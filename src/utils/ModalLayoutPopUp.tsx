import React, { useEffect, useRef } from 'react';

interface ModalLayoutProps {
    children: React.ReactNode;
    setModal: (value: boolean) => void;
    addclas?: string;
}

const ModalLayoutPopUp: React.FC<ModalLayoutProps> = ({ children, setModal, addclas }) => {
    const refdiv = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (refdiv.current && !refdiv.current.contains(e.target as Node)) {
                setModal(false);
            }
        };

        window.addEventListener('click', handleClickOutside, true);

        return () => {
            window.removeEventListener('click', handleClickOutside, true);
        };
    }, [setModal]);

    return (
        <div className="w-full z-100 h-screen fixed bg-[#3f3f3f9d] flex top-0 left-0 items-center justify-center  backdrop-blur-sm">
            <div ref={refdiv} className={`${addclas} max-h-[90dvh] overflow-y-auto`}>
                {children}
            </div>
        </div>
    );
};

export default ModalLayoutPopUp;