import React from 'react'

export default function SubSectionHeading(props) {
    return (
        <div className="m-4">
            <h1 className=" font-primary text-2xl font-semibold tracking-wider">{props.heading}</h1>
        </div>
    )
}
