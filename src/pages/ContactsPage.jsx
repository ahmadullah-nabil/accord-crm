import React from 'react'
import { Users } from 'lucide-react'
import { useContacts }            from '../hooks/useContacts.js'
import { useContactsStore }       from '../stores/contactsStore.js'
import { ContactsSummaryBar }     from '../components/contacts/ContactsSummaryBar.jsx'
import { ContactsToolbar }        from '../components/contacts/ContactsToolbar.jsx'
import { ContactsTable }          from '../components/contacts/ContactsTable.jsx'
import { ContactDetailPanel }     from '../components/contacts/ContactDetailPanel.jsx'
import { ContactFormModal }        from '../components/contacts/ContactFormModal.jsx'

export function ContactsPage() {
  const { data: allContacts = [], isLoading, isError } = useContacts()
  const { applyFilters } = useContactsStore()

  const filtered = applyFilters(allContacts)

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-sm text-red-500">Failed to load contacts. Please try again.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4 max-w-[1600px]">
        {/* Page heading */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center ring-1 ring-purple-200">
            <Users size={18} className="text-purple-600" />
          </div>
          <div>
            <h1 className="font-display font-bold text-gray-900 text-xl leading-tight">Contacts</h1>
            <p className="text-xs text-gray-500">Your full contact directory</p>
          </div>
        </div>

        {/* Summary pills */}
        <ContactsSummaryBar contacts={allContacts} />

        {/* Toolbar */}
        <ContactsToolbar total={allContacts.length} filtered={filtered.length} />

        {/* Table */}
        <ContactsTable contacts={filtered} isLoading={isLoading} />
      </div>

      {/* Detail panel */}
      <ContactDetailPanel />

      {/* Add / Edit modal */}
      <ContactFormModal />
    </>
  )
}

export default ContactsPage
