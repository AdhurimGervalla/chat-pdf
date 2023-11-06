import React from 'react'

type Props = {
    options: string[];
    label?: string;
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select = ({options, label, className, onChange}: Props) => {
  return (
    <div className={`${className}`}>
        {label && (
            <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                {label}
            </label>
        )}
      <select
        id="location"
        name="location"
        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        defaultValue="Canada"
        onChange={onChange}
      >
        {options.map((option, index) => (
            <option key={index}>{option}</option>
        ))}
      </select>
    </div>
  )
}

export default Select