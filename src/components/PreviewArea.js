import React from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ sprites }) {
    return (
        <div className="flex-1 h-full relative bg-gray-100 overflow-hidden">
            {sprites.map((sprite) => (
                <div
                    key={sprite.id}
                    className="absolute"
                    style={{
                        transform: `translate(${sprite.position?.x || 0}px, ${sprite.position?.y || 0}px) rotate(${sprite.position?.rotation || 0}deg)`,
                        cursor: "move"
                    }}
                >
                    {sprite.speech?.visible && (
                        <div
                            className="absolute px-3 py-1 rounded shadow bg-white text-black text-sm"
                            style={{
                                left: "40px",
                                top: "-30px",
                                maxWidth: "200px",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {sprite.speech.message}
                        </div>
                    )}
                    <CatSprite />
                </div>
            ))}
        </div>
    );
}

