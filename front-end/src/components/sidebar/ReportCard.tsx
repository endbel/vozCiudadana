import type { Report } from "./Sidebar";

interface ReportCardProps {
  report: Report;
  onClick?: (report: Report) => void;
}

export default function ReportCard({ report, onClick }: ReportCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(report);
    }
  };

  return (
    <div
      className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      {/* Category Tag */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {report.category}
        </span>
      </div>

      {/* Title */}
      <h4 className="font-medium text-gray-900 mb-1">{report.title}</h4>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
        {report.description}
      </p>

      {/* Date */}
      <p className="text-xs text-gray-500">{report.date}</p>
    </div>
  );
}
