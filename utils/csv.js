const json2csv = (data, fields) => {
  if (!data || data.length === 0) return ""

  // Create header
  const header = fields.join(",")

  // Create rows
  const rows = data.map((row) => {
    return fields
      .map((field) => {
        const value = row[field]
        // Escape quotes and wrap in quotes if contains comma
        if (value === null || value === undefined) return ""
        const stringValue = String(value)
        if (stringValue.includes(",") || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(",")
  })

  return [header, ...rows].join("\n")
}

module.exports = { json2csv }
