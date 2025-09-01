import React, { useState, useEffect } from 'react'
// createDatabaseSchema may not exist in local/dev setup. Import module and guard.
import * as dbModule from '../lib/database'
import { useDataMigration } from '../hooks/useSupabase'

interface SupabaseIntegrationProps {
  onMigrationComplete: () => void
  showNotification: (message: string) => void
}

const SupabaseIntegration: React.FC<SupabaseIntegrationProps> = ({
  onMigrationComplete,
  showNotification
}) => {
  const [schemaCreated, setSchemaCreated] = useState(false)
  const [creatingSchema, setCreatingSchema] = useState(false)
  const { migrating, migrationError, importMockData } = useDataMigration()

    const handleCreateSchema = async () => {
    setCreatingSchema(true)
    try {
      if (typeof (dbModule as any).createDatabaseSchema === 'function') {
        const success = await (dbModule as any).createDatabaseSchema()
        if (success) {
          setSchemaCreated(true)
          showNotification('Database schema created successfully!')
        } else {
          showNotification('Failed to create database schema')
        }
      } else {
        showNotification('createDatabaseSchema is not available in this build')
      }
    } catch (error) {
      console.error('Error creating schema:', error)
      showNotification('Error creating database schema')
    } finally {
      setCreatingSchema(false)
    }
  }

  const handleImportData = async () => {
    try {
      await importMockData()
      showNotification('Mock data imported successfully!')
      onMigrationComplete()
    } catch (error) {
      console.error('Error importing data:', error)
      showNotification('Error importing mock data')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Supabase Integration Setup
      </h2>
      
      <div className="space-y-6">
        {/* Step 1: Create Schema */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3 ${
              schemaCreated ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              1
            </span>
            Create Database Schema
          </h3>
          <p className="text-gray-600 mb-4">
            This will create all necessary tables in your Supabase database for the dashboard modules.
          </p>
          <button
            onClick={handleCreateSchema}
            disabled={creatingSchema || schemaCreated}
            className={`px-4 py-2 rounded-lg font-medium ${
              schemaCreated
                ? 'bg-green-500 text-white cursor-not-allowed'
                : creatingSchema
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {creatingSchema ? 'Creating Schema...' : schemaCreated ? 'Schema Created ✓' : 'Create Schema'}
          </button>
        </div>

        {/* Step 2: Import Mock Data */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm mr-3 ${
              !schemaCreated ? 'bg-gray-400' : 'bg-blue-500'
            }`}>
              2
            </span>
            Import Mock Data
          </h3>
          <p className="text-gray-600 mb-4">
            Import sample data for all modules including clients, projects, team members, and more.
          </p>
          <button
            onClick={handleImportData}
            disabled={!schemaCreated || migrating}
            className={`px-4 py-2 rounded-lg font-medium ${
              !schemaCreated || migrating
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {migrating ? 'Importing Data...' : 'Import Mock Data'}
          </button>
          {migrationError && (
            <p className="text-red-500 text-sm mt-2">Error: {migrationError}</p>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
          <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
            <li>Make sure you have enabled Supabase integration</li>
            <li>Click "Create Schema" to set up the database tables</li>
            <li>Click "Import Mock Data" to populate with sample data</li>
            <li>The dashboard will automatically switch to use Supabase data</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default SupabaseIntegration