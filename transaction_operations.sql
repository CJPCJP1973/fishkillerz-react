-- Transaction Management SQL Operations
-- Run these SQL statements in Supabase to set up triggers and functions
-- for automatic status updates when stakes are confirmed

-- ============================================================================
-- TRIGGER: Automatically update transaction updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS transactions_update_timestamp ON transactions;
CREATE TRIGGER transactions_update_timestamp
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_transactions_updated_at();

-- ============================================================================
-- FUNCTION: Confirm Transaction and Update Session Status
-- ============================================================================
-- Call this function when admin confirms a transaction
-- Parameters:
--   p_transaction_id: ID of the transaction to confirm
--   p_admin_id: ID of the admin confirming the transaction

CREATE OR REPLACE FUNCTION confirm_transaction(
  p_transaction_id BIGINT,
  p_admin_id BIGINT
)
RETURNS TABLE (
  transaction_id BIGINT,
  new_status transaction_status,
  session_status session_status,
  confirmed_timestamp TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_session_id BIGINT;
BEGIN
  -- Get the session_id from the transaction
  SELECT session_id INTO v_session_id
  FROM transactions
  WHERE id = p_transaction_id;

  -- Confirm the transaction
  UPDATE transactions
  SET
    status = 'Active'::transaction_status,
    confirmed_by = p_admin_id,
    confirmation_timestamp = NOW(),
    updated_at = NOW()
  WHERE id = p_transaction_id
  AND status = 'Pending Admin Confirmation'::transaction_status;

  -- Update session status to 'Active' if currently 'Open'
  UPDATE sessions
  SET
    status = 'Active'::session_status,
    updated_at = NOW()
  WHERE id = v_session_id
  AND status = 'Open'::session_status;

  -- Return the updated transaction details
  RETURN QUERY
  SELECT
    p_transaction_id,
    'Active'::transaction_status,
    s.status,
    NOW()
  FROM sessions s
  WHERE s.id = v_session_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCTION: Reject Transaction
-- ============================================================================
-- Call this function when admin rejects a transaction
-- Parameters:
--   p_transaction_id: ID of the transaction to reject
--   p_admin_id: ID of the admin rejecting the transaction
--   p_rejection_reason: Reason for rejection

CREATE OR REPLACE FUNCTION reject_transaction(
  p_transaction_id BIGINT,
  p_admin_id BIGINT,
  p_rejection_reason TEXT
)
RETURNS TABLE (
  transaction_id BIGINT,
  new_status transaction_status,
  rejection_reason TEXT
) AS $$
BEGIN
  -- Reject the transaction
  UPDATE transactions
  SET
    status = 'Rejected'::transaction_status,
    confirmed_by = p_admin_id,
    rejection_reason = p_rejection_reason,
    updated_at = NOW()
  WHERE id = p_transaction_id
  AND status = 'Pending Admin Confirmation'::transaction_status;

  -- Return the updated transaction details
  RETURN QUERY
  SELECT
    p_transaction_id,
    'Rejected'::transaction_status,
    p_rejection_reason;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- VIEW: Pending Stakes Admin Dashboard
-- ============================================================================
-- Use this view in your admin dashboard to display pending stakes
-- Joins transactions with sessions and users for easy filtering

CREATE OR REPLACE VIEW pending_stakes_view AS
SELECT
  t.id as transaction_id,
  t.session_id,
  t.user_id,
  t.amount,
  t.status,
  t.payment_method,
  t.payment_username,
  t.created_at,
  s.total_buy_in,
  s.status as session_status,
  -- User info would come from your users table
  -- u.username as user_name,
  -- u.avatar as user_avatar,
  -- Calculate max stake (75% of total_buy_in)
  (s.total_buy_in * 0.75) as max_stake_allowed,
  -- Calculate locked stake (25% of total_buy_in)
  (s.total_buy_in * 0.25) as locked_stake,
  -- Calculate percentage of max stake
  (t.amount / (s.total_buy_in * 0.75) * 100)::NUMERIC(5,2) as stake_percentage
FROM
  transactions t
  INNER JOIN sessions s ON t.session_id = s.id
WHERE
  t.status = 'Pending Admin Confirmation'
ORDER BY
  t.created_at DESC;

-- ============================================================================
-- USEFUL QUERIES
-- ============================================================================

-- Get all pending stakes with session details
-- SELECT * FROM pending_stakes_view;

-- Get pending stakes for a specific session
-- SELECT * FROM pending_stakes_view WHERE session_id = $1;

-- Get total pending amount for a session
-- SELECT session_id, SUM(amount) as total_pending FROM transactions
-- WHERE session_id = $1 AND status = 'Pending Admin Confirmation'
-- GROUP BY session_id;

-- Get confirmation rate (confirmed vs total)
-- SELECT
--   COUNT(CASE WHEN status = 'Active' THEN 1 END)::FLOAT / COUNT(*) * 100 as confirmation_rate
-- FROM transactions;

-- ============================================================================
-- EXAMPLE: How to use the confirm_transaction function
-- ============================================================================
-- SELECT * FROM confirm_transaction(123, 456);
-- (123 = transaction ID, 456 = admin user ID)

-- ============================================================================
-- EXAMPLE: How to use the reject_transaction function
-- ============================================================================
-- SELECT * FROM reject_transaction(123, 456, 'Invalid payment details');
-- (123 = transaction ID, 456 = admin user ID, message = rejection reason)
