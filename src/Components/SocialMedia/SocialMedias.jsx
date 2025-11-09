import React from 'react'
import "./SocialMedia.css"

const SocialMedias = ({ color, posicion, size}) => {
    return (
        <div className="socials" style={{
            display: "flex",
            flexDirection: posicion === "column" ? "column" : "row"
        }}>
            <a href="https://www.facebook.com/santiago.cuellar.56829" aria-label="Facebook" className="icon" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
                    <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 4.97 3.66 9.09 8.44 9.88v-6.99H7.9v-2.89h2.4V9.41c0-2.38 1.42-3.69 3.59-3.69 1.04 0 2.12.18 2.12.18v2.33h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.62l-.42 2.89h-2.2v6.99c4.78-.79 8.44-4.91 8.44-9.88z" />
                </svg>
            </a>

            <a href="https://github.com/santrix12G?tab=repositories" aria-label="GitHub" className="github-icon" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
                    <path
                        d="M12 0a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61a3.18 3.18 0 0 0-1.34-1.76c-1.1-.75.09-.74.09-.74a2.52 2.52 0 0 1 1.83 1.23 2.55 2.55 0 0 0 3.48 1 2.54 2.54 0 0 1 .76-1.6c-2.67-.3-5.47-1.34-5.47-5.95a4.66 4.66 0 0 1 1.24-3.22 4.33 4.33 0 0 1 .12-3.18s1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23a4.33 4.33 0 0 1 .12 3.18 4.66 4.66 0 0 1 1.24 3.22c0 4.63-2.8 5.64-5.48 5.94a2.84 2.84 0 0 1 .81 2.2v3.26c0 .32.22.69.83.58A12 12 0 0 0 12 0z"
                    />
                </svg>
            </a>

            <a href="https://x.com" aria-label="X" className="icon" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
                    <path d="M22 5.92c-.66.3-1.37.5-2.12.6.76-.46 1.34-1.19 1.62-2.06-.71.42-1.5.72-2.34.88A3.77 3.77 0 0 0 12.5 8.5c0 .3.03.6.1.88C8.09 9.22 4.3 7.1 1.67 3.6c-.33.57-.52 1.23-.52 1.94 0 1.33.68 2.5 1.72 3.19-.63 0-1.22-.19-1.74-.48v.05c0 1.86 1.32 3.41 3.07 3.76-.32.09-.66.13-1.01.13-.25 0-.5-.02-.74-.07.5 1.6 1.95 2.76 3.66 2.79A7.58 7.58 0 0 1 2 19.54a10.7 10.7 0 0 0 5.78 1.7c6.93 0 10.73-5.75 10.73-10.73v-.49c.73-.53 1.36-1.19 1.86-1.95-.67.3-1.39.5-2.14.59z" />
                </svg>
            </a>

            <a href="https://www.linkedin.com/in/santiago-cu%C3%A9llar-gonz%C3%A1lez-687495229/" aria-label="LinkedIn" className="icon" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true">
                    <path d="M4.98 3.5A2.5 2.5 0 1 1 4.98 8.5 2.5 2.5 0 0 1 4.98 3.5zM3 9h4v12H3zM9 9h3.8v1.6h.05c.53-1 1.83-2.05 3.77-2.05C20.2 8.55 21 10.6 21 13.6V21h-4v-6.7c0-1.6-.03-3.7-2.25-3.7-2.25 0-2.6 1.76-2.6 3.58V21H9z" />
                </svg>
            </a>
        </div>
    )
}

export default SocialMedias