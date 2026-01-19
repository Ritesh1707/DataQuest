const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

const url = 'mongodb://localhost:27017';
const dbName = 'hackathon';

async function main() {
  const client = new MongoClient(url);

  try {
    await client.connect();
    console.log('Connected correctly to server');
    const db = client.db(dbName);

    // Collections
    const courses = db.collection('Course');
    const modules = db.collection('Module');
    const lessons = db.collection('Lesson');
    const exercises = db.collection('Exercise');
    
    // === CLEAR DATA but keep Users ===
    console.log('Clearing content data...');
    try {
      await courses.deleteMany({});
      await modules.deleteMany({});
      await lessons.deleteMany({});
      await exercises.deleteMany({});
    } catch (e) { console.log('Clean error', e); }

    // === COURSE ===
    const courseResult = await courses.insertOne({
      title: 'Databricks Solution Architect Masterclass',
      description: 'The complete guide to designing, securing, and optimizing production-grade Lakehouse solutions on Databricks.',
      slug: 'databricks-sa-masterclass',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const courseId = courseResult.insertedId;

    // Helper to create module
    const createModule = async (title, desc, order) => {
      const res = await modules.insertOne({
        title,
        description: desc,
        order,
        courseId,
        createdAt: new Date()
      });
      return res.insertedId;
    };

    // Helper to create lesson & exercise
    const createLesson = async (modId, title, content, order, exPrompt, exStart, exSol) => {
      const lRes = await lessons.insertOne({
        title, content, order, moduleId: modId, createdAt: new Date()
      });
      await exercises.insertOne({
        prompt: exPrompt, starterCode: exStart, solution: exSol, order: 1, lessonId: lRes.insertedId
      });
    };

    // === 1. Lakehouse Paradigm ===
    const m1 = await createModule('The Lakehouse Paradigm', 'Understanding the core architecture of the modern data stack.', 1);
    await createLesson(m1, 'Medallion Architecture', '# Medallion Architecture\n\nThe standard for data quality...', 1, 
      'Task: Filter nulls from the raw dataframe.', 
      'const df_silver = df_bronze.', 'dropDuplicates');

    // === 2. Performance Optimization ===
    const m2 = await createModule('Performance Optimization', 'Techniques to speed up your queries and reduce costs.', 2);
    await createLesson(m2, 'Z-Ordering & Data Skipping', '# Z-Ordering\n\nCo-locate related information...', 1, 
      'Task: Construct the OPTIMIZE string.', 
      'const sql = "OPTIMIZE table ..."', 'ZORDER BY');

    // === 3. Unity Catalog Governance ===
    const m3 = await createModule('Unity Catalog Governance', 'Centralized access control and data lineage.', 3);
    await createLesson(m3, 'Three-Level Namespace', '# Namespace\n\nCatalog.Schema.Table...', 1, 
      'Task: Grant SELECT permission.', 
      'const sql = "GRANT ..."', 'GRANT SELECT');

    // === 4. Structured Streaming ===
    const m4 = await createModule('Structured Streaming', 'Real-time data processing patterns and best practices.', 4);
    await createLesson(m4, 'Streaming Concepts', 
      '# Structured Streaming\n\nTreating a stream as an unbounded table.\n\n## Triggers\n- **Default**: Micro-batch\n- **AvailableNow**: Process all available data then stop (cost effective)', 1,
      'Task: set the trigger to "AvailableNow" in the writeStream configuration.',
      'df.writeStream.trigger({ ... })', 'availableNow');

    // === 5. Delta Lake Internals ===
    const m5 = await createModule('Delta Lake Internals', 'Deep dive into the transaction log and storage format.', 5);
    await createLesson(m5, 'The Transaction Log', 
      '# The _delta_log\n\nDelta Lake uses a transaction log to guarantee ACID properties.\n\nType: JSON files (commits) and Checkpoint files (Parquet).', 1,
      'Task: Identify the command to clean up old log files.',
      '// SQL command to remove old files', 'VACUUM');

    // === 6. Auto Loader ===
    const m6 = await createModule('Auto Loader', 'Ingesting files from cloud storage efficiently.', 6);
    await createLesson(m6, 'CloudFiles Source', 
      '# Auto Loader\n\nScalable file ingestion using `cloudFiles`.\n\n## Schema Evolution\nAuto Loader can automatically detect and evolve schema changes.', 1,
      'Task: Set the format to "cloudFiles" in the readStream.',
      'spark.readStream.format(...)', 'cloudFiles');

    // === 7. Databricks SQL ===
    const m7 = await createModule('Databricks SQL & Warehousing', 'Serverless data warehousing and visualization.', 7);
    await createLesson(m7, 'Serverless SQL Warehouses', 
      '# SQL Warehouses\n\nCompute resources optimized for SQL queries.\n\n- **Serverless**: Instant startup, auto-scaling.\n- **Pro**: Better for custom endpoints.', 1,
      'Task: Write a query to count customers by region.',
      'SELECT region, count(*) FROM customers GROUP BY ...', 'GROUP BY');

    // === 8. Machine Learning Engineering ===
    const m8 = await createModule('ML Engineering with Mosaic AI', 'Managing the full ML lifecycle on Databricks.', 8);
    await createLesson(m8, 'Feature Store', 
      '# Feature Store\n\nA centralized repository for features.\n\nBenefits:\n- **Consistency**: Same features for training and inference.\n- **Discovery**: Reuse features across teams.', 1,
      'Task: Create a feature table using the correct client.',
      'feature_store_client.create_table(...)', 'create_table');

    // === 9. Data Engineering Optimization ===
    const m9 = await createModule('Advanced DE Patterns', 'Complex transformations and orchestration.', 9);
    await createLesson(m9, 'Change Data Capture (CDC)', 
      '# CDC with Delta Live Tables\n\nHandling updates and deletes efficiently.\n\nUsing `APPLY CHANGES INTO` logic.', 1,
      'Task: Specify the keys to match on for the merge operation.',
      'APPLY CHANGES INTO target FROM source KEYS (...)', 'KEYS');

    // === 10. Security & Compliance ===
    const m10 = await createModule('Security & Compliance', 'Network security, encryption, and audit logging.', 10);
    await createLesson(m10, 'Private Link & Connectivity', 
      '# Network Security\n\n- **Private Link**: Secure connection between your VNet and Databricks Control Plane.\n- **Customer-Managed Keys**: Encrypt data with your own keys.', 1,
      'Task: Define the function to enable customer-managed keys (pseudo-code).',
      'enable_cmk(key_vault_uri)', 'enable_cmk');

    console.log('=== SEEDING COMPLETE: 10 Modules Created ===');

  } catch (text) {
    console.error(text);
  } finally {
    await client.close();
  }
}

main();
