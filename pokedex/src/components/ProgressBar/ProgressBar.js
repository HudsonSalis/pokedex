import React from "react";  




const ProgressBar = (props) => {

    const {bgColor, completed} = props;

    const containerStyles = {
        height: 180,
        width: 20,
        backgroundColor: "#e0e0de",
        display: 'flex'

      }
    
      const fillerStyles = {
        height: `${completed/2}%`,
        width: '100%',
        backgroundColor: bgColor,
        borderRadius: 'inherit',
        textAlign: 'right',
        alignSelf: 'flex-end',
      }
    
      const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold'
      }
    
      return (
        <div style={containerStyles}>
          <div style={fillerStyles}>
            <span style={labelStyles}>{`${completed}`}</span>
          </div>
        </div>
      );
    };

export default ProgressBar;