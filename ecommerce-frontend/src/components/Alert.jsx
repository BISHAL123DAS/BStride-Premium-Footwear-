const Alert = ({ type = "error", message }) => {
  if (!message) return null;

  const styles = {
    error: "bg-red-950/50 border-red-800 text-red-400",
    success: "bg-green-950/50 border-green-800 text-green-400",
  };

  return (
    <div
      className={`flex items-center gap-3 border rounded-lg px-4 py-3 text-sm ${styles[type]}`}
    >
      <span className="font-bold text-base"></span>
      <span>{message}</span>
    </div>
  );
};

export default Alert;
