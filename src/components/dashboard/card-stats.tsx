import {Card} from "antd";
import React from "react";

interface CardStatsProps {
    title: React.ReactNode,
    value: number,
    color?: string,
    prefix?: React.ReactNode,
    suffix?: React.ReactNode,
    icon?: React.ReactElement,
}

const cardStyle = {
    height: '100%',
}

const iconContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#1890ff',
}

const iconStyle = {
    fontSize: '24px',
    color: 'white',
}

export default function CardStats({title, value, color = '', prefix, suffix, icon}: CardStatsProps) {
    return (
        <Card style={{...cardStyle, backgroundColor: '#e6f7ff'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                    <p style={{fontSize: '18px', fontWeight: 500, marginBottom: '4px'}}>{title}</p>
                    <h2 style={{fontSize: '28px', fontWeight: 700, margin: 0}}>{value}</h2>
                </div>
                <div style={iconContainerStyle}>
                    {icon && React.cloneElement(icon, {style: iconStyle})}
                </div>
            </div>
        </Card>
    )
}