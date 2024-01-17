export default function Loader({ view = '' }) {
  const style =
    view === 'absolute'
      ? {
          textAlign: 'center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          display: 'grid',
          placeItems: 'center',
          backgroundColor: '#fff',
        }
      : { textAlign: 'center' };

  return (
    <div style={style}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '52px', height: '100px' }}
      >
        <circle fill="#8989a2" stroke="none" cx="6" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.1"
          />
        </circle>
        <circle fill="#8989a2" stroke="none" cx="26" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.2"
          />
        </circle>
        <circle fill="#8989a2" stroke="none" cx="46" cy="50" r="6">
          <animate
            attributeName="opacity"
            dur="1s"
            values="0;1;0"
            repeatCount="indefinite"
            begin="0.3"
          />
        </circle>
      </svg>
    </div>
  );
}
