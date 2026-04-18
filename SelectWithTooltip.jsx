import React, { useState, useRef, useEffect } from 'react'
import './SelectWithTooltip.css'

export default function SelectWithTooltip({
  id,
  name,
  value,
  onChange,
  options,
  details,
  label,
  displayMap
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredOption, setHoveredOption] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)

  const getDisplayName = (option) => {
    return displayMap?.[option] || option
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    const event = { target: { name, value: option } }
    onChange(event)
    setIsOpen(false)
    setHoveredOption(option)
  }

  const handleMouseEnter = (option) => {
    setHoveredOption(option)
    if (dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()
      setTooltipPosition({
        top: dropdownRect.top - containerRect.top,
        left: dropdownRect.right - containerRect.left + 15
      })
    }
  }

  return (
    <div className="select-tooltip-wrapper" ref={containerRef}>
      <label htmlFor={id}>{label}</label>
      
      <div className="custom-select-container">
        <button
          id={id}
          type="button"
          className="custom-select-button"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => {
            if (isOpen) {
              setHoveredOption(value)
              if (dropdownRef.current) {
                const dropdownRect = dropdownRef.current.getBoundingClientRect()
                const containerRect = containerRef.current.getBoundingClientRect()
                setTooltipPosition({
                  top: dropdownRect.top - containerRect.top,
                  left: dropdownRect.right - containerRect.left + 15
                })
              }
            }
          }}
        >
          <span className="select-value">{getDisplayName(value)}</span>
          <span className="select-arrow">{isOpen ? '▲' : '▼'}</span>
        </button>

        {isOpen && (
          <div className="custom-dropdown-menu" ref={dropdownRef}>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                className={`dropdown-option ${option === value ? 'selected' : ''} ${
                  option === hoveredOption ? 'hovered' : ''
                }`}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => handleMouseEnter(option)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                {getDisplayName(option)}
              </button>
            ))}
          </div>
        )}
      </div>

      {hoveredOption && details[hoveredOption] && isOpen && (
        <div
          className="tooltip-box"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
        >
          <div className="tooltip-content">
            <div className="tooltip-title">{hoveredOption}</div>
            <div className="tooltip-details">
              {Object.entries(details[hoveredOption]).map(([key, val]) => (
                <div key={key} className="tooltip-row">
                  <span className="tooltip-label">
                    {key
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())}
                    :
                  </span>
                  <span className="tooltip-value">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden select for form submission */}
      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{ display: 'none' }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
