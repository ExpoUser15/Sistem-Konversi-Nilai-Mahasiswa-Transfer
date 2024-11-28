function Tables({ fields, gap, children, className }) {
    return (
        <div className="overflow-x-auto sm:overflow-x-hidden mb-2">
            <div className={`min-w-[700px] sm:max-h-fit grid grid-cols-${String(fields.length)} text-[#676767] mb-5 text-sm-3 gap-${gap} pb-2 ${className}`} style={{borderBottom: "1px solid #CCCCCC"}}>
                {fields.map((item, index) => (
                    <div key={btoa(index)} className="text-wrap">{item}</div>
                ))}
            </div>
            {children}
        </div>
    )
}

export default Tables