import { useState, useCallback, useRef, useEffect, type FC } from "react";
import { useClickAway } from "react-use";

interface Option {
  value: string;
  text: string;
}

type SearchableSelectProps = {
  options: Option[];
  defaultCurrent?: number;
  placeholder: string;
  className?: string;
  onChange: (item: Option, name: string) => void;
  name: string;
  value?: string;
}

const SearchableSelect: FC<SearchableSelectProps> = ({
  options,
  defaultCurrent = 0,
  placeholder,
  className,
  onChange,
  name,
  value,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [current, setCurrent] = useState<Option | null>(
    defaultCurrent >= 0 && options[defaultCurrent] && options[defaultCurrent].value !== "" 
      ? options[defaultCurrent] 
      : null
  );
  const searchInputRef = useRef<HTMLInputElement>(null);
  const onClose = useCallback(() => {
    setOpen(false);
    setSearchTerm("");
  }, []);
  const ref = useRef<HTMLDivElement | null>(null);

  useClickAway(ref, onClose);

  // Update current when value prop changes
  useEffect(() => {
    if (value) {
      const option = options.find(opt => opt.value === value);
      if (option) {
        setCurrent(option);
      }
    }
  }, [value, options]);

  // Focus search input when opened
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const currentHandler = (item: Option) => {
    setCurrent(item);
    onChange(item, name);
    onClose();
  };

  const filteredOptions = options.filter((option) =>
    option.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayText = current?.text || placeholder;

  return (
    <div
      className={`nice-select form-select-lg ${className || ""} ${open ? "open" : ""}`}
      role="button"
      tabIndex={0}
      onClick={() => {
        setOpen((prev) => !prev);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((prev) => !prev);
        }
      }}
      ref={ref}
    >
      <span className="current">{displayText}</span>
      <ul
        className="list"
        role="menubar"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <li className="search-box" onClick={(e) => e.stopPropagation()}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="search-input"
          />
        </li>
        {filteredOptions.length > 0 ? (
          filteredOptions.map((item, i) => (
            <li
              key={i}
              data-value={item.value}
              className={`option ${item.value === current?.value ? "selected focus" : ""}`}
              style={{ fontSize: "14px" }}
              role="menuitem"
              onClick={() => currentHandler(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  currentHandler(item);
                }
              }}
            >
              {item.text}
            </li>
          ))
        ) : (
          <li className="option disabled" style={{ fontSize: "14px" }}>
            No results found
          </li>
        )}
      </ul>
    </div>
  );
};

export default SearchableSelect;

