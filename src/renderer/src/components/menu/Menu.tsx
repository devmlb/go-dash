import {
    cloneElement,
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
    type JSX,
    type ReactNode,
} from "react";

import "./Menu.css";

type Entry = {
    name: string;
    icon?: JSX.Element;
    disabled?: boolean;
    onClick?: () => void;
};

function Menu({
    target,
    entries,
    className,
    offsetX = 0,
    offsetY = 8,
}: {
    target: ReactNode;
    entries: Entry[];
    className?: string;
    offsetX?: number;
    offsetY?: number;
}): JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const closeMenu = (): void => setIsOpen(false);
    const toggleMenu = (): void => setIsOpen((current) => !current);

    const updateMenuPosition = useCallback((): void => {
        if (!menuRef.current || !triggerRef.current) {
            return;
        }

        const targetRect = triggerRef.current.getBoundingClientRect();
        if (
            targetRect.left + menuRef.current.getBoundingClientRect().width >
            window.innerWidth
        ) {
            menuRef.current.style.right = "0";
        } else {
            menuRef.current.style.left = "0";
        }

        menuRef.current.style.top = `${targetRect.height + offsetY}px`;
    }, [offsetY]);

    const updateMenuHeight = (): void => {
        if (!menuRef.current || !contentRef.current) {
            return;
        }

        const contentHeight = contentRef.current.scrollHeight;
        // Padding top / bottom = 6px
        const finalHeight = contentHeight + 6 * 2;

        menuRef.current.style.setProperty(
            "--menu-open-max-height",
            `${finalHeight}px`,
        );
    };

    useLayoutEffect(() => {
        if (!isOpen) return;

        updateMenuHeight();
        updateMenuPosition();
    }, [isOpen, entries, offsetX, offsetY, updateMenuPosition]);

    useEffect(() => {
        if (!isOpen) return;

        const handleDocumentClick = (event: PointerEvent): void => {
            const target = event.target;

            if (
                !target ||
                !(target instanceof Node) ||
                menuRef.current?.contains(target) ||
                triggerRef.current?.contains(target)
            ) {
                return;
            }

            closeMenu();
        };

        document.addEventListener("click", handleDocumentClick);
        window.addEventListener("resize", updateMenuPosition);
        window.addEventListener("scroll", updateMenuPosition, true);

        return () => {
            document.removeEventListener("click", handleDocumentClick);
            window.removeEventListener("resize", updateMenuPosition);
            window.removeEventListener("scroll", updateMenuPosition, true);
        };
    }, [isOpen, offsetX, offsetY, updateMenuPosition]);

    return (
        <div className={className ? `menu-root ${className}` : "menu-root"}>
            <div ref={triggerRef} onClick={toggleMenu}>
                {target}
            </div>
            <div
                ref={menuRef}
                className={isOpen ? "menu open" : "menu"}
                aria-hidden={!isOpen}
            >
                <div ref={contentRef} className="entries">
                    {entries.map((entry, index) => (
                        <MenuEntry
                            key={index}
                            name={entry.name}
                            icon={entry.icon}
                            disabled={entry.disabled}
                            onClick={entry.onClick}
                            onClose={closeMenu}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function MenuEntry({
    name,
    icon,
    disabled,
    onClick = () => {},
    onClose,
}: {
    name: string;
    icon?: JSX.Element;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    onClose: () => void;
}): JSX.Element {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        onClose();
        onClick?.(e);
    };

    return (
        <button
            type="button"
            className="menu-entry"
            disabled={disabled}
            onClick={handleClick}
        >
            {icon ? cloneElement(icon, { size: 16, strokeWidth: 2 }) : null}
            <span className="menu-entry-label">{name}</span>
        </button>
    );
}

export { Menu };
