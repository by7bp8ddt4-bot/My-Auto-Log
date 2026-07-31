import DocumentsPage from '../components/DocumentsPage.jsx';

export default function DocumentsPageWrapper({
  localDocuments, handleAddDocument, handleDeleteDocument,
  vehicles, navigate, userId,
}) {
  return (
    <DocumentsPage
      documents={localDocuments.data}
      onAddDocument={handleAddDocument}
      onDeleteDocument={handleDeleteDocument}
      vehicles={vehicles}
      onNavigate={navigate}
      userId={userId}
    />
  );
}
