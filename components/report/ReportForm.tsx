import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import { Category } from "@/types";
import '@/styles/ReportForm.css';

interface ReportFormProps {
  categories: Category[];
  categoryId: string | number;
  setCategoryId: (val: string | number) => void;
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  imagePreview: string | null;
  isUploadingImage: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  location: { lat: number; lng: number } | null;
  gettingLocation: boolean;
  onGetLocation: () => void;
  handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  statusMessage: string | null;
}

export default function ReportForm({
  categories,
  categoryId,
  setCategoryId,
  title,
  setTitle,
  description,
  setDescription,
  imagePreview,
  isUploadingImage,
  onImageChange,
  onRemoveImage,
  location,
  gettingLocation,
  onGetLocation,
  handleSubmit,
  isSubmitting,
  statusMessage,
}: ReportFormProps) {
  return (
    <form onSubmit={handleSubmit} className="report-form-card">
      {statusMessage && <div className="report-alert-box">{statusMessage}</div>}

      <div className="report-group">
        <label className="report-label">Incident Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="" disabled>Select a category...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="report-group">
        <label className="report-label">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g., Car crash on Main Sreet"
        />
      </div>

      <div className="report-group">
        <label className="report-label">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="Provide details..."
        />
      </div>

      <div className="report-group">
        <button
          type="button"
          onClick={onGetLocation}
          disabled={gettingLocation}
          className="btn-secondary"
        >
          <span><IoLocationSharp size={20} /></span>
          <span>{gettingLocation ? "Detecting Location..." : location ? "Location Attached" : "Attach Current Location"}</span>
        </button>
        {location && (
          <p className="text-[10px] text-gray-500 mt-1 text-center">
            Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}
          </p>
        )}
      </div>

      <div className="report-group-second">
        <label className="report-label">Photo Evidence</label>
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
        />
        {imagePreview && (
          <div className="report-image-preview">
            <img src={imagePreview} alt="Preview" className="report-image" />
            <button
              type="button"
              onClick={onRemoveImage}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || isUploadingImage}
        className="btn-danger"
      >
        {isUploadingImage
          ? "Uploading Image..."
          : isSubmitting
          ? "Submitting Report..."
          : "Submit Emergency Report"}
      </button>
    </form>
  );
}