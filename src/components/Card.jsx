import React from 'react';

const Card = ({ children, logo, title, style = {}, ...props }) => (
  <div className="card" style={style} {...props}>
    {logo && <img src={logo} alt="Logo" className="card-logo" />}
    {title && <h2>{title}</h2>}
    {children}
  </div>
);

export default Card; 