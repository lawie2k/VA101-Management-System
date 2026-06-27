<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Database Conventions & Soft Deletes

- **Soft Deletes Only:** Do NOT perform hard deletes (`DELETE` SQL statements or Prisma `.delete()` / `.deleteMany()`) on business-related data tables in this system.
- **Implementation Pattern:** 
  - To delete a record, update its status column to `"deleted"` (or set its `archived_at` / `deleted_at` timestamp if available).
  - All read/fetch queries (e.g., Prisma `.findMany()`, `.findUnique()`) must filter out deleted records (e.g., `where: { status: { not: "deleted" } }`).
