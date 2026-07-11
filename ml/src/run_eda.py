import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os
import nbformat as nbf

# Setup paths
DATA_PATH = 'data/yield_df.csv'
PLOTS_DIR = 'outputs/plots'
NOTEBOOK_PATH = 'notebooks/eda.ipynb'
REPORT_PATH = 'outputs/plots/eda_report.md'

os.makedirs(PLOTS_DIR, exist_ok=True)
os.makedirs('notebooks', exist_ok=True)

df = pd.read_csv(DATA_PATH)
df = df.drop(columns=['Unnamed: 0'], errors='ignore')

# 1. Plots & Analysis
report = []
report.append("# Exploratory Data Analysis Report\n")

# Dataset overview
report.append("## Dataset Overview")
report.append(f"- **Shape**: {df.shape}")
report.append("\n### Data Types\n```\n" + str(df.dtypes) + "\n```")

# Missing values
missing = df.isnull().sum()
report.append("\n### Missing Values\n```\n" + str(missing) + "\n```")

# Duplicate rows
duplicates = df.duplicated().sum()
report.append(f"\n- **Duplicate Rows**: {duplicates}")

# Descriptive stats
desc = df.describe().to_markdown()
report.append("\n### Descriptive Statistics\n\n" + desc)

# Unique areas and crops
report.append(f"\n- **Unique Areas**: {df['Area'].nunique()}")
report.append(f"- **Unique Crops**: {df['Item'].nunique()}")

numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
categorical_cols = df.select_dtypes(include=['object']).columns

# Feature Distributions (Histograms)
for col in numeric_cols:
    plt.figure(figsize=(8, 5))
    sns.histplot(df[col], kde=True)
    plt.title(f'Distribution of {col}')
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, f'hist_{col}.png'))
    plt.close()

# Boxplots for outliers
for col in numeric_cols:
    plt.figure(figsize=(8, 5))
    sns.boxplot(x=df[col])
    plt.title(f'Boxplot of {col}')
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, f'box_{col}.png'))
    plt.close()

# Correlation matrix
plt.figure(figsize=(10, 8))
corr = df[numeric_cols].corr()
sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
plt.title('Correlation Matrix')
plt.tight_layout()
plt.savefig(os.path.join(PLOTS_DIR, 'correlation_matrix.png'))
plt.close()

# Scatter plots vs Target
target = 'hg/ha_yield'
features = [col for col in numeric_cols if col != target]
for col in features:
    plt.figure(figsize=(8, 5))
    sns.scatterplot(x=df[col], y=df[target], alpha=0.5)
    plt.title(f'{col} vs {target}')
    plt.tight_layout()
    plt.savefig(os.path.join(PLOTS_DIR, f'scatter_{col}_vs_{target}.png'))
    plt.close()

# Top 10 Areas and Items by Yield
top_areas = df.groupby('Area')[target].mean().sort_values(ascending=False).head(10)
plt.figure(figsize=(12, 6))
sns.barplot(x=top_areas.values, y=top_areas.index)
plt.title('Top 10 Areas by Average Yield')
plt.tight_layout()
plt.savefig(os.path.join(PLOTS_DIR, 'bar_top_areas.png'))
plt.close()

top_items = df.groupby('Item')[target].mean().sort_values(ascending=False).head(10)
plt.figure(figsize=(12, 6))
sns.barplot(x=top_items.values, y=top_items.index)
plt.title('Top 10 Crops by Average Yield')
plt.tight_layout()
plt.savefig(os.path.join(PLOTS_DIR, 'bar_top_crops.png'))
plt.close()

with open(REPORT_PATH, 'w') as f:
    f.write("\n".join(report))

# 2. Create eda.ipynb
nb = nbf.v4.new_notebook()
cells = []

cells.append(nbf.v4.new_markdown_cell("# Exploratory Data Analysis"))
cells.append(nbf.v4.new_code_cell("import pandas as pd\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nimport warnings\nwarnings.filterwarnings('ignore')\n\ndf = pd.read_csv('../data/yield_df.csv')\ndf = df.drop(columns=['Unnamed: 0'], errors='ignore')"))

cells.append(nbf.v4.new_markdown_cell("## Dataset Overview"))
cells.append(nbf.v4.new_code_cell("print(f'Shape: {df.shape}')\ndf.head()"))
cells.append(nbf.v4.new_code_cell("df.info()"))

cells.append(nbf.v4.new_markdown_cell("## Missing Values & Duplicates"))
cells.append(nbf.v4.new_code_cell("print('Missing Values:')\nprint(df.isnull().sum())\nprint('\\nDuplicates:', df.duplicated().sum())"))

cells.append(nbf.v4.new_markdown_cell("## Descriptive Statistics"))
cells.append(nbf.v4.new_code_cell("df.describe()"))

cells.append(nbf.v4.new_markdown_cell("## Feature Distributions"))
cells.append(nbf.v4.new_code_cell("numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns\ndf[numeric_cols].hist(bins=30, figsize=(15, 10))\nplt.tight_layout()\nplt.show()"))

cells.append(nbf.v4.new_markdown_cell("## Outlier Detection (Boxplots)"))
cells.append(nbf.v4.new_code_cell("plt.figure(figsize=(15, 10))\nfor i, col in enumerate(numeric_cols, 1):\n    plt.subplot(2, 3, i)\n    sns.boxplot(x=df[col])\n    plt.title(col)\nplt.tight_layout()\nplt.show()"))

cells.append(nbf.v4.new_markdown_cell("## Correlation Matrix"))
cells.append(nbf.v4.new_code_cell("plt.figure(figsize=(10, 8))\nsns.heatmap(df[numeric_cols].corr(), annot=True, cmap='coolwarm', fmt='.2f')\nplt.title('Correlation Matrix')\nplt.show()"))

cells.append(nbf.v4.new_markdown_cell("## Target Relationships"))
cells.append(nbf.v4.new_code_cell("target = 'hg/ha_yield'\nfeatures = [c for c in numeric_cols if c != target]\nplt.figure(figsize=(15, 10))\nfor i, col in enumerate(features, 1):\n    plt.subplot(2, 2, i)\n    sns.scatterplot(x=df[col], y=df[target], alpha=0.5)\n    plt.title(f'{col} vs {target}')\nplt.tight_layout()\nplt.show()"))

nb['cells'] = cells
with open(NOTEBOOK_PATH, 'w') as f:
    nbf.write(nb, f)

print('EDA complete. Notebook and plots saved.')
