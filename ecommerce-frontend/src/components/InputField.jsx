const InputField = ({ label, type = "text", name, value, onChange, placeholder, required }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-zinc-400 font-medium" htmlFor={name}>
        {label}
        {required && <span className="text-lime-400 ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="
          bg-zinc-900 border border-zinc-700 text-white
          placeholder:text-zinc-600 text-sm rounded-lg
          px-4 py-3 outline-none
          focus:border-lime-400 focus:ring-1 focus:ring-lime-400/30
          transition-all duration-200
        "
      />
    </div>
  );
};

export default InputField;
