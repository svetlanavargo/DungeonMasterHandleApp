import { useState } from "react";
import styles from "./Logo.module.css";

export default function Logo() {
    const [currentFace, setCurrentFace] = useState(20);
    const [rolling, setRolling] = useState(false);

    const handleRoll = () => {
        if (rolling) return;
        setRolling(true);

        const totalDuration = 1000; // 2 секунды броска
        const steps = 30;
        const decay = 1.05;
        let interval = totalDuration / steps;

        const rollStep = (step: number) => {
            if (step >= steps) {
                // финальное число
                setCurrentFace(Math.floor(Math.random() * 20 + 1));
                setRolling(false);
                return;
            }

            setCurrentFace(Math.floor(Math.random() * 20 + 1));
            interval = interval * decay;
            setTimeout(() => rollStep(step + 1), interval);
        };

        rollStep(0);
    };

    return (
        <div className={styles.logoWrapper}>
            <div
                className={`${styles.logo} ${rolling ? styles.rolling : ""}`}
                onClick={handleRoll}
            >
                {currentFace}
            </div>
        </div>
    );
}