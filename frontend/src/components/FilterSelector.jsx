import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { ChevronDown, Check } from "lucide-react";

// Styled Components for the reusable Filter Selector
const DropdownContainer = styled.div`
	position: relative;
	flex: 1;
	min-width: 170px;
	@media (min-width: 640px) {
		flex: none;
		width: 190px;
	}
`;

const DropdownButton = styled.button`
	width: 100%;
	background-color: rgba(17, 24, 39, 0.7);
	color: #ffffff;
	padding: 0.85rem 1.25rem;
	border-radius: 0.75rem;
	border: 1px solid rgba(55, 65, 81, 0.8);
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.5rem;
	font-size: 0.875rem;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	user-select: none;

	&:hover {
		border-color: #10b981;
		background-color: rgba(17, 24, 39, 0.85);
		box-shadow: 0 0 12px rgba(16, 185, 129, 0.2);
	}

	&:focus {
		outline: none;
		border-color: #10b981;
		box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.35);
	}
`;

const DropdownLabel = styled.span`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: left;
`;

const ChevronWrapper = styled.span`
	display: flex;
	align-items: center;
	transition: transform 0.3s ease;
	transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
	color: #9ca3af;
`;

const DropdownMenu = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	margin-top: 0.5rem;
	background-color: rgba(17, 24, 39, 0.95);
	backdrop-filter: blur(16px);
	border: 1px solid rgba(16, 185, 129, 0.4);
	border-radius: 0.75rem;
	box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.6), 0 10px 15px -5px rgba(0, 0, 0, 0.6);
	z-index: 50;
	overflow: hidden;
	max-height: 280px;
	overflow-y: auto;
	animation: filterDropdownFade 0.25s cubic-bezier(0.16, 1, 0.3, 1);

	@keyframes filterDropdownFade {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	&::-webkit-scrollbar {
		width: 6px;
	}
	&::-webkit-scrollbar-track {
		background: transparent;
	}
	&::-webkit-scrollbar-thumb {
		background: rgba(16, 185, 129, 0.35);
		border-radius: 3px;
	}
	&::-webkit-scrollbar-thumb:hover {
		background: rgba(16, 185, 129, 0.6);
	}
`;

const DropdownItem = styled.div`
	display: flex;
	align-items: center;
	gap: 0.75rem;
	padding: 0.75rem 1.25rem;
	font-size: 0.875rem;
	color: ${props => props.$active ? '#10b981' : '#d1d5db'};
	font-weight: ${props => props.$active ? '600' : '400'};
	background-color: ${props => props.$active ? 'rgba(16, 185, 129, 0.08)' : 'transparent'};
	cursor: pointer;
	transition: all 0.2s ease;
	user-select: none;

	&:hover {
		background-color: rgba(16, 185, 129, 0.15);
		color: #ffffff;
	}
`;

const CheckboxContainer = styled.div`
	width: 18px;
	height: 18px;
	border: 2px solid ${props => props.$checked ? '#10b981' : '#4b5563'};
	border-radius: 4px;
	background-color: ${props => props.$checked ? '#10b981' : 'transparent'};
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	flex-shrink: 0;

	&:hover {
		border-color: #10b981;
	}
`;

const FilterSelector = ({
	label,
	options = [],
	selectedValues,
	onChange,
	isMultiSelect = false,
	placeholderAll
}) => {
	const dropdownRef = useRef(null);
	const [isOpen, setIsOpen] = useState(false);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleItemClick = (optionId) => {
		if (isMultiSelect) {
			const current = Array.isArray(selectedValues) ? selectedValues : [];
			if (current.includes(optionId)) {
				onChange(current.filter((id) => id !== optionId));
			} else {
				onChange([...current, optionId]);
			}
		} else {
			onChange(optionId);
			setIsOpen(false);
		}
	};

	const isChecked = (optionId) => {
		if (isMultiSelect) {
			return Array.isArray(selectedValues) && selectedValues.includes(optionId);
		}
		return selectedValues === optionId;
	};

	const getButtonLabel = () => {
		if (isMultiSelect) {
			const current = Array.isArray(selectedValues) ? selectedValues : [];
			if (current.length === 0) {
				return placeholderAll || `All ${label}s`;
			}
			if (current.length === 1) {
				const found = options.find((o) => o.id === current[0]);
				return found ? found.label : `1 ${label}`;
			}
			return `${current.length} ${label}s`;
		} else {
			const found = options.find((o) => o.id === selectedValues);
			return found ? found.label : label;
		}
	};

	return (
		<DropdownContainer ref={dropdownRef}>
			<DropdownButton onClick={() => setIsOpen(!isOpen)} type="button">
				<DropdownLabel>{getButtonLabel()}</DropdownLabel>
				<ChevronWrapper $isOpen={isOpen}>
					<ChevronDown size={16} />
				</ChevronWrapper>
			</DropdownButton>
			{isOpen && (
				<DropdownMenu>
					{options.map((option) => {
						const checked = isChecked(option.id);
						return (
							<DropdownItem
								key={option.id}
								onClick={() => handleItemClick(option.id)}
								$active={checked}
							>
								<CheckboxContainer $checked={checked}>
									{checked && <Check size={12} className="stroke-[3px] text-white" />}
								</CheckboxContainer>
								<span>{option.label}</span>
							</DropdownItem>
						);
					})}
				</DropdownMenu>
			)}
		</DropdownContainer>
	);
};

export default FilterSelector;
