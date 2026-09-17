import { Route, Routes } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import BookReaderPage from './pages/BookReaderPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import SubjectBooksPage from './pages/SubjectBooksPage'
import RequireAuth from './admin/auth/RequireAuth'
import AdminLayout from './admin/components/layout/AdminLayout'
import AdminLoginPage from './admin/pages/AdminLoginPage'
import AdminDashboardPage from './admin/pages/AdminDashboardPage'
import AdminBooksPage from './admin/pages/AdminBooksPage'
import AdminBookFormPage from './admin/pages/AdminBookFormPage'
import AdminQuestionsPage from './admin/pages/AdminQuestionsPage'
import AdminQuestionFormPage from './admin/pages/AdminQuestionFormPage'
import AdminChaptersPage from './admin/pages/AdminChaptersPage'
import AdminSettingsPage from './admin/pages/AdminSettingsPage'
import AdminImportantPage from './admin/pages/AdminImportantPage'
import AdminImportantFormPage from './admin/pages/AdminImportantFormPage'
import ImportantTopicsPage from './pages/ImportantTopicsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/books" element={<AdminBooksPage all />} />
        <Route path="/admin/questions" element={<AdminQuestionsPage all />} />
        <Route path="/admin/settings" element={<AdminSettingsPage />} />
        <Route path="/admin/subjects/:subjectId/books" element={<AdminBooksPage />} />
        <Route path="/admin/subjects/:subjectId/books/new" element={<AdminBookFormPage />} />
        <Route path="/admin/subjects/:subjectId/books/:bookId/edit" element={<AdminBookFormPage />} />
        <Route path="/admin/subjects/:subjectId/books/:bookId/chapters" element={<AdminChaptersPage />} />
        <Route path="/admin/subjects/:subjectId/books/:bookId/questions" element={<AdminQuestionsPage />} />
        <Route path="/admin/subjects/:subjectId/books/:bookId/questions/new" element={<AdminQuestionFormPage />} />
        <Route path="/admin/subjects/:subjectId/books/:bookId/questions/:questionId/edit" element={<AdminQuestionFormPage />} />
        <Route path="/admin/subjects/:subjectId/important" element={<AdminImportantPage />} />
        <Route path="/admin/subjects/:subjectId/important/new/:kind" element={<AdminImportantFormPage />} />
        <Route path="/admin/subjects/:subjectId/important/:itemId/edit" element={<AdminImportantFormPage />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/subjects/:subjectId" element={<SubjectBooksPage />} />
        <Route path="/subjects/:subjectId/important" element={<ImportantTopicsPage />} />
        <Route path="/subjects/:subjectId/important/:kind" element={<ImportantTopicsPage />} />
        <Route path="/subjects/:subjectId/books/:bookId" element={<BookReaderPage />} />
        <Route path="/subjects/:subjectId/books/:bookId/:chapterId/math/:topicNumber" element={<BookReaderPage />} />
        <Route
          path="/subjects/:subjectId/books/:bookId/:chapterId/:year/:type"
          element={<BookReaderPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
