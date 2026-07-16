// components/OrderTracker.js
// Renders a horizontal step timeline: Confirmed → Processing → Shipped → Delivered
const STEP_LABELS = {
  confirmed:  'Confirmed',
  processing: 'Processing',
  shipped:    'Shipped',
  delivered:  'Delivered',
};
const STEP_ICONS = {
  confirmed:  'fa-check',
  processing: 'fa-box-open',
  shipped:    'fa-truck',
  delivered:  'fa-house',
};

export default function OrderTracker({ tracking }) {
  if (!tracking) return null;

  if (tracking.cancelled) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 18px', background: '#fdecea', border: '1px solid #e74c3c' }}>
        <i className="fas fa-circle-xmark" style={{ color: '#e74c3c' }} />
        <span style={{ fontSize: '.82rem', color: '#c0392b', fontWeight: 500 }}>This order was cancelled</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', padding: '20px 4px' }}>
      {tracking.steps.map((step, i) => (
        <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: i < tracking.steps.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step.done ? 'var(--gold)' : '#fff',
              border: `2px solid ${step.done ? 'var(--gold)' : 'var(--gold-pale)'}`,
              color: step.done ? '#fff' : 'var(--gray)',
              fontSize: '.8rem',
              boxShadow: step.current ? '0 0 0 4px rgba(201,168,76,.2)' : 'none',
            }}>
              <i className={`fas ${STEP_ICONS[step.key]}`} />
            </div>
            <span style={{
              fontSize: '.66rem', letterSpacing: '.08em', textTransform: 'uppercase',
              marginTop: '8px', textAlign: 'center',
              color: step.done ? 'var(--dark)' : 'var(--gray)',
              fontWeight: step.current ? 600 : 400,
            }}>
              {STEP_LABELS[step.key]}
            </span>
          </div>
          {i < tracking.steps.length - 1 && (
            <div style={{ flex: 1, height: '2px', marginBottom: '26px', background: tracking.steps[i + 1].done ? 'var(--gold)' : 'var(--gold-pale)' }} />
          )}
        </div>
      ))}
    </div>
  );
}
