// src/components/Toast.jsx
export default function Toast({ id, title, description, onClose }) {
    return (
      <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-md p-4 mb-4">
        <strong>{title}</strong>
        <p>{description}</p>
        <button onClick={() => onClose(id)} className="text-red-500 mt-2">Fèmen</button>
      </div>
    );
  }
  