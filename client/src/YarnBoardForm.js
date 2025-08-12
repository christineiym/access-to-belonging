import { useState } from "react";


export default function ModernForm({ handleSubmit, handleCancel, dropdownOptions, checkboxOptions }) {
  const [selectedDropdown, setSelectedDropdown] = useState("");
  const [dropdownOther, setDropdownOther] = useState("");

  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [checkboxOther, setCheckboxOther] = useState("");

  const toggleCheckbox = (option) => {
    setCheckedBoxes((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const safeHandleSubmit = (e) => {
    e.preventDefault();
    if (checkedBoxes.length === 0) {
      alert("Please select at least one choice.");
      return;
    }
    const formData = {
      dropdown: selectedDropdown === "Other" ? dropdownOther.trim() : selectedDropdown,
      checkboxes: checkedBoxes.map((c) => (c === "Other" ? checkboxOther.trim() : c)),
    };
    handleSubmit(formData);
  };

  return (
    <form
      onSubmit={safeHandleSubmit}
      className="w-full max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6"
    >
      {/* Dropdown + Checkbox Row */}
      <div className="flex items-start gap-6">
        {/* Dropdown */}
        <div className="flex-1">
          <label htmlFor="dropdown-select" className="block font-medium mb-1">
            Select an option
          </label>
          <select
            id="dropdown-select"
            value={selectedDropdown}
            onChange={(e) => setSelectedDropdown(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="" disabled>
              Select...
            </option>
            {dropdownOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {selectedDropdown === "Other" && (
            <div className="mt-2">
              <label htmlFor="dropdown-other" className="sr-only">
                Specify other option
              </label>
              <input
                id="dropdown-other"
                type="text"
                placeholder="Please specify"
                value={dropdownOther}
                onChange={(e) => setDropdownOther(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
        </div>

        {/* Checkbox List */}
        <div className="flex-1">
          <fieldset>
            <legend className="block font-medium mb-1">
              Select choices
            </legend>
            <div className="space-y-2">
              {checkboxOptions.map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`checkbox-${option}`}
                    checked={checkedBoxes.includes(option)}
                    onChange={() => toggleCheckbox(option)}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`checkbox-${option}`}>
                    {option}
                  </label>
                </div>
              ))}
              {checkedBoxes.includes("Other") && (
                <div className="mt-2">
                  <label htmlFor="checkbox-other" className="sr-only">
                    Specify other choice
                  </label>
                  <input
                    id="checkbox-other"
                    type="text"
                    placeholder="Please specify"
                    value={checkboxOther}
                    onChange={(e) => setCheckboxOther(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>
          </fieldset>
        </div>
      </div>

      {/* Cancel and Submit Buttons */}
      <div className="flex justify-end gap-4">
        <button type="button" onClick={handleCancel} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">Cancel</button>
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">Submit</button>
      </div>
    </form>
  );
}