import React, { useState } from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ sprites, setSpritePosition }) {
    const [draggingId, setDraggingId] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e, sprite) => {
        // Prevent text/image selection while dragging
        e.preventDefault();
        setDraggingId(sprite.id);

        const containerRect = e.currentTarget.parentElement.getBoundingClientRect();

        setOffset({
            x: e.clientX - containerRect.left - sprite.position.x,
            y: e.clientY - containerRect.top - sprite.position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (draggingId !== null) {
            const previewAreaRect = e.currentTarget.getBoundingClientRect();
            const newX = e.clientX - previewAreaRect.left - offset.x;
            const newY = e.clientY - previewAreaRect.top - offset.y;

            setSpritePosition(draggingId, { x: newX, y: newY });
        }
    };

    const handleMouseUp = () => {
        setDraggingId(null);
    };

    return (
        <div
            className="flex-1 h-full relative bg-gray-100 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {sprites.map((sprite) => (
                <div
                    key={sprite.id}
                    className="absolute"
                    style={{
                        transform: `translate(${sprite.position?.x || 0}px, ${sprite.position?.y || 0}px) rotate(${sprite.position?.rotation || 0}deg)`,
                        cursor: "move",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, sprite)}
                >
                    {sprite.speech?.visible && (
                        <div
                            className="absolute px-3 py-1 rounded shadow bg-white text-black text-sm"
                            style={{
                                left: "40px",
                                top: "-30px",
                                maxWidth: "200px",
                                whiteSpace: "nowrap",
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
