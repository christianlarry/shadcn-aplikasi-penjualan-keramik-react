import CatalogSidebarFilter from './catalog-sidebar-filter'

const CatalogSidebar = () => {
  return (
    <aside className="max-w-[300px] w-full">
      <div className="rounded-md border-1 border-border p-4">

        <CatalogSidebarFilter/>

      </div>
    </aside>
  )
}

export default CatalogSidebar