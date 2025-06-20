'use client'

import { useState, useCallback } from 'react'
import { UploadCloud } from 'lucide-react'

export default function UploadCsv() {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile)
    } else {
      alert('Please upload a CSV file')
    }
  }, [])

  const handleFileInput = useCallback((e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile)
    } else {
      alert('Please upload a CSV file')
    }
  }, [])

  return (
    <div
      className={`w-full max-w-2xl h-24 border-2 border-dashed rounded-lg flex items-center justify-between px-6 transition-colors ${
        isDragging ? 'border-primary bg-primary/10' : 'border-gray-300'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      aria-label="CSV file upload area"
    >
      <div className="flex items-center">
        <UploadCloud className="w-8 h-8 text-muted-foreground mr-4" />
        <div className="text-left">
          <p className="text-sm font-medium text-foreground">
            {file ? file.name : 'Drag & drop your CSV file here'}
          </p>
          <p className="text-xs text-muted-foreground mt-1">or select a file from your computer</p>
        </div>
      </div>
      <button
        variant="outline"
        size="sm"
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        Select File
      </button>
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        className="sr-only"
        onChange={handleFileInput}
        aria-label="Upload CSV file"
      />
    </div>
  )
}