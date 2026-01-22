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

    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    // HELPER FUNCTIONS
    // ==========================================
    const createCourse = async (title, slug, desc, tags = [], difficulty = 'BEGINNER') => {
      const res = await courses.insertOne({
        title, slug, description: desc, tags, difficulty, createdAt: new Date(), updatedAt: new Date()
      });
      return res.insertedId;
    };

    const createModule = async (courseId, title, desc, order) => {
      const res = await modules.insertOne({
        title, description: desc, order, courseId, createdAt: new Date()
      });
      return res.insertedId;
    };

    const createLesson = async (moduleId, title, content, order, exPrompt, exStart, exSol) => {
      const lRes = await lessons.insertOne({
        title, content, order, moduleId, createdAt: new Date()
      });
      await exercises.insertOne({
        prompt: exPrompt, starterCode: exStart, solution: exSol, order: 1, lessonId: lRes.insertedId
      });
    };

    // ==========================================
    // COURSE 1: SOLUTION ARCHITECT
    // ==========================================
    console.log('Seeding Course 1: Solution Architect...');
    const c1 = await createCourse(
      'Databricks Solution Architect Masterclass', 
      'databricks-sa-masterclass',
      'The complete guide to designing, securing, and optimizing production-grade Lakehouse solutions.',
      ['Architecture', 'SQL', 'Delta Lake', 'Unity Catalog'],
      'ADVANCED'
    );

    const m1_1 = await createModule(c1, 'The Lakehouse Paradigm', 'Medallion Architecture & Data Quality', 1);
    await createLesson(m1_1, 'Medallion Architecture Design', `
# Medallion Architecture: The Foundation of Lakehouse

The **Medallion Architecture** is a data design pattern used to logically organize data in a Lakehouse. It aims to incrementally improve the structure and quality of data as it flows through the architecture (from Bronze -> Silver -> Gold).

## The Three Layers

### 1. Bronze Layer (Raw Ingestion)
- **Objective:** Maintain the raw state of data sources.
- **Characteristics:** Immutable, Append-Only.
- **Format:** Often stored in optimized formats like Parquet/Delta, but retains the original schema.
- **Usage:** Replayability. If you find a bug in your transformation logic later, you can always reprocess from Bronze.

### 2. Silver Layer (Refined/Cleansed)
- **Objective:** Match, merge, conform, and cleanse data ("Enterprise View").
- **Transformations:** Filtering nulls, deduplication, schema enforcement, data type casting.
- **Usage:** Ad-hoc analysis, data science, and operational reporting.

### 3. Gold Layer (Business-Level Aggregates)
- **Objective:** Consumption-ready for business use cases.
- **Structure:** Often denormalized (Star Schema) or aggregated.
- **Usage:** PowerBI, Tableau, executive dashboards.

## Why this matters?
This architecture simplifies the data pipeline, improves data quality, and allows for distinct personas (Data Engineers work on Bronze/Silver, Analysts on Gold) to collaborate effectively.
    `, 1, 'Task: Filter nulls from the raw dataframe.', 'const df_silver = df_bronze.', 'dropDuplicates');

    const m1_2 = await createModule(c1, 'Performance Optimization', 'Z-Ordering, Partitioning, and Skipping', 2);
    await createLesson(m1_2, 'Z-Ordering and Data Skipping', `
# Z-Ordering & Data Skipping

One of the most powerful features of Delta Lake on Databricks is the ability to skip reading irrelevant data. This is achieved through **Data Skipping** and **Z-Ordering**.

## How Data Skipping Works
Delta Lake automatically collects min/max statistics for every column in every file written. When a query contains a filter (e.g., \`WHERE id = 5\`), Databricks checks these stats. If the value \`5\` falls outside the min/max range of a file, that file is completely skipped.

## What is Z-Ordering?
Z-Ordering is a technique to co-locate related information in the same set of files. It maps multidimensional data to one dimension while preserving locality.

### When to Z-Order?
- High Cardinality columns (e.g., \`CustomerID\`, \`Timestamp\`).
- Columns frequently used in \`WHERE\` clauses.

### Partitioning vs. Z-Ordering
- **Partitioning**: Best for low cardinality (Date, Region). Creates physical directories.
- **Z-Ordering**: Best for high cardinality within partitions.

**Command:**
\`\`\`sql
OPTIMIZE events
ZORDER BY (eventType, timestamp)
\`\`\`
    `, 1, 'Construct OPTIMIZE cmd.', 'const sql = "OPTIMIZE ..."', 'ZORDER BY');

    const m1_3 = await createModule(c1, 'Unity Catalog Governance', 'Security & Lineage', 3);
    await createLesson(m1_3, 'The Three-Level Namespace', `
# Unity Catalog: The Three-Level Namespace

Unity Catalog provides a unified governance layer for all data and AI assets across your Databricks workspaces. The core of this model is the **Three-Level Namespace**.

## Structure
\`catalog.schema.table\`

1.  **Catalog**: The top-level container. Typically maps to a business unit (e.g., \`finance_prod\`) or environment (\`dev\`, \`prod\`).
2.  **Schema (Database)**: Logical grouping of tables and views (e.g., \`ap_invoices\`, \`employee_records\`).
3.  **Table/View/Volume**: The actual data asset.

## Key Benefits
- **No more Workspace Silos**: A user in Workspace A can query data managed by Workspace B if they have permissions on the Catalog.
- **Centralized Audit Logs**: Every access attempt is logged centrally.
- **Data Lineage**: Automatically track column-level lineage from source to dashboard.

## Managing Permissions
SQL-standard commands are used to manage access:
\`\`\`sql
GRANT SELECT ON CATALOG prod TO data_scientists;
GRANT CREATE TABLE ON SCHEMA proj_alpha TO engineering_team;
\`\`\`
    `, 1, 'Grant SELECT.', 'GRANT SELECT ...', 'GRANT');

    
    // ==========================================
    // COURSE 2: DATA ENGINEER ASSOCIATE
    // ==========================================
    console.log('Seeding Course 2: Data Engineer Associate...');
    const c2 = await createCourse(
      'Databricks Data Engineer Associate',
      'data-engineer-associate',
      'Start your journey here. Master the fundamentals of ELT, Delta Lake, and Spark SQL.',
      ['Data Engineering', 'PySpark', 'SQL', 'Python'],
      'BEGINNER'
    );

    const m2_1 = await createModule(c2, 'Databricks Workspace Foundations', 'Notebooks, compute, and repos.', 1);
    await createLesson(m2_1, 'Working with Notebooks', `
# Databricks Notebooks

Databricks Notebooks are a collaborative feature that allows you to create, run, and share code and visualizations. They support multiple languages (Python, SQL, Scala, R) within the same notebook.

## Key Features
- **Magic Commands**: Use \`%python\`, \`%sql\`, \`%sh\` to switch languages or run shell commands.
- **Markdown Support**: Document your code using standard markdown (like this text!).
- **Visualizations**: built-in plotting tools (display() function) and support for libraries like Matplotlib.
- **Widget API**: Create interactive parameters for your notebooks.

## Running Notebooks from Notebooks
You can modularize your code by calling one notebook from another using the \`%run\` magic command.
\`%run ./Setup_Variables\`

This executes the referenced notebook in the current context, making all defined variables and functions available.
    `, 1, 'Task: Write a command to run a notebook named "setup".', '// Magic command', '%run');

    const m2_2 = await createModule(c2, 'Relational Entities on Databricks', 'Databases, Tables, and Views.', 2);
    await createLesson(m2_2, 'Managed vs External Tables', `
# Managed vs. External Tables

When creating tables in Databricks (and Hive metastore), understanding the difference between Managed and External tables is critical for data governance and storage management.

## Managed Tables (Default)
- **Command**: \`CREATE TABLE table_name ...\`
- **Behavior**: Databricks manages **both** the metadata (in the metastore) and the actual data files (in DBFS or managed cloud storage).
- **Dropping**: If you \`DROP TABLE\`, the data files **are deleted** immediately.

## External (Unmanaged) Tables
- **Command**: \`CREATE TABLE table_name LOCATION 's3://...'\`
- **Behavior**: Databricks manages the metadata, but you manage the data files in your own storage bucket.
- **Dropping**: If you \`DROP TABLE\`, the metadata is removed, but the data files **persist** in storage.

## Best Practice
Use **Managed Tables** for intermediate data and standard ET L. Use **External Tables** when data needs to be accessed by tools outside of Databricks or when you need strict control over file retention policies.
    `, 1, 'Task: Create a managed table named `sales`.', 'const sql = "CREATE TABLE ..."', 'CREATE TABLE');

    const m2_3 = await createModule(c2, 'ELT with Spark SQL', 'Extract, Load, Transform using SQL.', 3);
    await createLesson(m2_3, 'Writing to Delta Tables', `
# Writing to Delta Tables

Spark SQL is the primary interface for many Data Engineers. Delta Lake brings ACID transactions to your big data workloads.

## CTAS (Create Table As Select)
The most common pattern for ELT is the CTAS statement. It infers the schema from the query results and creates the table automatically.
\`\`\`sql
CREATE TABLE silver_users
AS SELECT id, name, email
FROM bronze_users
WHERE status = 'Active'
\`\`\`

## MERGE INTO (Upserts)
Handling updates and inserts ("upserts") is complex in traditional data lakes. Delta makes it easy with \`MERGE INTO\`.
\`\`\`sql
MERGE INTO target t 
USING source s ON t.id = s.id
WHEN MATCHED THEN UPDATE SET t.data = s.data
WHEN NOT MATCHED THEN INSERT *
\`\`\`
    `, 1, 'Task: Create a table `customers_silver` from `customers_bronze`.', 'const sql = "CREATE TABLE ..."', 'AS SELECT');

    const m2_4 = await createModule(c2, 'Delta Live Tables (DLT)', 'Declarative ETL pipelines.', 4);
    await createLesson(m2_4, 'Defining DLT Pipelines', `
# Delta Live Tables (DLT)

DLT is a framework for building reliable, maintainable, and testable data processing pipelines. Instead of defining strictly procedural tasks, you define the *final state* of your tables.

## Expectations (Data Quality)
DLT treats data quality as a first-class citizen. You can define **Expectations** to enforce constraints.

- **EXPECT**: Warns in the event log but keeps data.
- **EXPECT ... ON VIOLATION DROP ROW**: Discards the bad record.
- **EXPECT ... ON VIOLATION FAIL UPDATE**: Stops the pipeline execution.

## Syntax
\`\`\`sql
CREATE LIVE TABLE valid_orders
(CONSTRAINT valid_amount EXPECT (amount > 0) ON VIOLATION DROP ROW)
AS SELECT * FROM live.raw_orders
\`\`\`
    `, 1, 'Task: Define a DLT expectation that drops invalid rows.', 'CONSTRAINT valid_id EXPECT (id IS NOT NULL) ...', 'ON VIOLATION DROP ROW');
    
    // ==========================================
    // COURSE 3: ML PROFESSIONAL
    // ==========================================
    console.log('Seeding Course 3: ML Professional...');
    const c3 = await createCourse(
      'Databricks Machine Learning Professional',
      'ml-professional',
      'End-to-end MLOps: Feature Stores, AutoML, MLflow, and Model Serving.',
      ['Machine Learning', 'Python', 'MLOps', 'Feature Store'],
      'INTERMEDIATE'
    );

    const m3_1 = await createModule(c3, 'Experiment Tracking', 'Managing experiments with MLflow.', 1);
    await createLesson(m3_1, 'MLflow Tracking API', `
# MLflow Tracking

Machine Learning development is iterative. You test hundreds of parameters (hyperparameters) to find the best model. Keeping track of these offline (spreadsheets) is painful.

## The MLflow Tracking Server
A centralized repository to log every run, including:
- **Parameters**: Learning rate, tree depth, etc.
- **Metrics**: Accuracy, RMSE, AUC.
- **Artifacts**: The serialized model file (pickle), plots, images.
- **Metadata**: Source code commit hash, start/end time.

## Usage
\`\`\`python
import mlflow

with mlflow.start_run():
    model = train_model(X, y, params)
    mlflow.log_param("alpha", 0.5)
    mlflow.log_metric("rmse", 0.89)
    mlflow.sklearn.log_model(model, "model")
\`\`\`
    `, 1, 'Task: Log a metric named "accuracy".', 'mlflow.log_metric(...)', 'log_metric');

    const m3_2 = await createModule(c3, 'Feature Engineering', 'The Databricks Feature Store.', 2);
    await createLesson(m3_2, 'Creating Feature Tables', `
# Databricks Feature Store

A Feature Store is a centralized repository that enables data scientists to find and share features and also ensures that the same code used for computing feature values is used for model training and inference.

## The Training-Serving Skew Problem
Often, features are created in batch (Python/SQL) for training. But at inference time (real-time), the logic must be rewritten in Java/C++ or running against a different database. This causes "skew" where the feature values differ.

## Solution
The Feature Store solves this by being the **Single Source of Truth**.
1. **Compute features once.**
2. **Write to Feature Store** (backed by Delta Lake).
3. **Train**: Fetch features for a training set.
4. **Serve**: Real-time lookup for online serving.

## Creation
\`\`\`python
fs = FeatureStoreClient()
fs.create_table(
    name="recommender_system.customer_features",
    primary_keys=["customer_id"],
    df=customer_df,
    description="Customer spending habits"
)
\`\`\`
    `, 1, 'Task: Create a feature table with keys.', 'fs.create_table(...)', 'primary_keys');

    // ==========================================
    // COURSE 4: SPARK OPTIMIZATION (INTERMEDIATE)
    // ==========================================
    console.log('Seeding Course 4: Spark Optimization...');
    const c4 = await createCourse(
      'Deep Dive: Spark Performance Tuning',
      'spark-optimization',
      'Master the art of tuning Spark applications. Learn about shuffles, skew, spills, and AQE.',
      ['Spark', 'PySpark', 'Data Engineering', 'Scala'],
      'INTERMEDIATE'
    );

    const m4_1 = await createModule(c4, 'Understanding the Catalyst Optimizer', 'How Spark executes your code.', 1);
    await createLesson(m4_1, 'Plans and Optimization', `
# Catalyst Optimizer
Spark SQL uses the Catalyst Optimizer to optimize all queries written in Spark SQL and the DataFrame API.

## The Phases
1. **Analysis**: Resolving references.
2. **Logical Optimization**: Rule-based optimizations (predicate pushdown).
3. **Physical Planning**: Cost-based optimization (join strategies).
4. **Code Generation**: Tungsten engine generates Java bytecode.
    `, 1, 'Task: Explain the role of Code Generation.', '// Tungsten...', 'bytecode');

    const m4_2 = await createModule(c4, 'Handling Data Skew', 'Strategies for skewed joins.', 2);
    await createLesson(m4_2, 'Salting and AQE', `
# Data Skew
Skew occurs when one partition has significantly more data than others, causing long-tail tasks.

## Solutions
1. **AQE (Adaptive Query Execution)**: Automatically splits large skewed partitions.
2. **Salting**: Adding a random key to redistribute data evenly during a join.
    `, 1, 'Task: Enable AQE.', 'spark.conf.set("spark.sql.adaptive.enabled", ...)', 'true');

    // ==========================================
    // COURSE 5: GENERATIVE AI (ADVANCED)
    // ==========================================
    console.log('Seeding Course 5: GenAI Engineering...');
    const c5 = await createCourse(
      'Generative AI Engineer',
      'genai-engineer',
      'Build production RAG applications with Vector Search, LangChain, and MosaicML.',
      ['Machine Learning', 'Python', 'AI', 'Architecture'],
      'ADVANCED'
    );

    const m5_1 = await createModule(c5, 'RAG Foundations', 'Retrieval Augmented Generation', 1);
    await createLesson(m5_1, 'Vector Search Concepts', `
# Vector Search
To enable LLMs to answer questions about *your* private data, you need RAG.

## Embeddings
Convert text into high-dimensional vectors. Similar meanings are close in space.

## Vector Database
Databricks Vector Search is a serverless vector database integrated with Unity Catalog. 
    `, 1, 'Task: Select an embedding model.', 'const model = "bge-large-en"', 'bge-large-en');

    console.log('=== SEEDING COMPLETE: 5 Courses Created ===');

  } catch (text) {
    console.error(text);
  } finally {
    await client.close();
  }
}

main();
