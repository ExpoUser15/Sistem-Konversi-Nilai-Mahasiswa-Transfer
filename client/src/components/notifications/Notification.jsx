import { useEffect, useRef } from "react";

const Notification = ({ className = "", text, status, notifRef, state }) => {

    useEffect(() => {
        if (state) {
            // Tampilkan notifikasi (reset animasi)
            notifRef.current.classList.replace("translate-x-[1000px]", "translate-x-[0]");

            const timer = setTimeout(() => {
                notifRef.current.classList.replace("translate-x-[0]", "translate-x-[1000px]");
            }, 6000);

            return () => clearTimeout(timer);
        }
    }, [state]);

    const bgColor = status === 'Success'
        ? "bg-[#DCFCE7] text-[#14532D]"
        : status === 'Warning'
            ? "bg-[#FEF9C3] text-[#CA8A04]"
            : "bg-[#FEE2E2] text-[#DC2626]";

    return (
        <div
            className={`fixed top-16 right-7 max-w-[300px] rounded-[15px] flex flex-row items-center justify-start py-[12px] px-3 box-border gap-[10px] leading-[normal] tracking-[normal] text-left text-[20px] translate-x-[1000px] ${bgColor} ${className} duration-1000 transition-all`}
            ref={notifRef}
        >
            <div className="flex flex-col items-start justify-start px-0 pb-0">
                <img
                    className="w-[24px] relative z-[1]"
                    loading="lazy"
                    alt=""
                    src={status === 'Success'
                        ? "/Vector.png"
                        : status === 'Warning'
                            ? "/VectorWarning.png"
                            : "/VectorError.png"}
                />
            </div>
            <div className="flex-1 relative leading-[16px] font-medium flex items-center mix-blend-normal min-w-[203px] text-sm-3 z-[1] text-wrap">
                {text}
            </div>
            {/* <audio src="/omg-bruh-oh-hell-nah.mp3" autoPlay ref={notifAudioRef}></audio> */}
        </div>
    );
};

export default Notification;
