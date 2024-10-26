function Tables({ fields, gap, children, className }) {
    return (
        <div className="max-h-fit overflow-x-hidden">
            <div className={`grid grid-cols-${String(fields.length)} text-[#676767] mb-5 text-sm-3 gap-${gap} pb-2 ${className}`} style={{borderBottom: "1px solid #CCCCCC"}}>
                {fields.map((item, index) => (
                    <div key={index}>{item}</div>
                ))}
            </div>
            {children}
        </div>
    )
}

export default Tables