import React from 'react';


function Switch({onChange, checked, text}) {
    const color = checked ? '#36B37E' : '#FF5151';
    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            <label className="switch">
                <input type="checkbox" checked={checked} onChange={onChange} />
                <span className="slider round"></span>
            </label>
            <p style={{marginLeft: '1em', fontSize: '1.2em', color}}>{text}</p>
        </div>
    );
}

export default Switch;

