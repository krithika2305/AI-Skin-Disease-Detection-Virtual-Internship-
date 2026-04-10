import React, { useState, useRef } from 'react';
import { uploadImage } from '../services/api';

export default function UploadImage() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        processFile(file);
    };

    const processFile = (file) => {
        if (file) {
            setSelectedImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUpload = async () => {
        if (!selectedImage) return;

        setLoading(true);
        try {
            const data = await uploadImage(selectedImage);
            // Simulate network delay for effect if too fast
            if (data) setTimeout(() => setResult(data), 500);
            else setResult(data);
        } catch (error) {
            alert("Failed to analyze image. Ensure backend is running.");
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    return (
        <div className="upload-container">
            <div
                className="upload-box card"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                    ref={fileInputRef}
                />

                {!preview ? (
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        <h3>Upload Image</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Drag & drop or click to select</p>
                    </div>
                ) : (
                    <div>
                        <img src={preview} alt="Preview" className="preview-img" style={{ maxHeight: '300px' }} />
                        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Click to change image</p>
                    </div>
                )}
            </div>

            {preview && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleUpload}
                        disabled={loading}
                        style={{ minWidth: '150px' }}
                    >
                        {loading ? 'Analyzing...' : 'Analyze Skin'}
                    </button>
                </div>
            )}

            {result && (
                <div className="card result-container">
                    <h3 className="result-header">Analysis Result</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>{result.prediction}</span>
                            <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{(result.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <div className="confidence-bar-bg">
                            <div
                                className="confidence-bar-fill"
                                style={{ width: `${result.confidence * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '0.5rem', borderLeft: '4px solid var(--primary)' }}>
                        <h4 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Recommendation</h4>
                        <p>{result.recommendation}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
