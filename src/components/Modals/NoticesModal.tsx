import type { ReactNode } from "react";
import styles from "./Modals.module.css";

interface NoticesProps {
    children: ReactNode;
    onClose: () => void;
}

function NoticesModal({ children, onClose }: NoticesProps) {
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default NoticesModal;