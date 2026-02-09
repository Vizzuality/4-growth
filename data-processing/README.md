4-Growth data processing
==============================

Directory for data processing scripts and notebooks. This is where you will find the code to clean and prepare the data for the project.

--------

## Setup

### The environment

**If the enviroment is not already created**

Create the environment with:

``` bash
uv venv
```

Initialize the project (if not already initialized), this will create the `project.toml` file (if it does not exist):

``` bash
uv init
```

To activate the environment:
``` bash
source .venv/bin/activate
```

To install packages and automatically track dependencies in the `pyproject.toml`file, use:
```bash
uv add <package-name>
```

To make the `hwpc` package available in the environment, you can install it in editable mode:
```bash
pip install -e .
```

**If the environment is already created**

To replicate the project environment on another machine:
``` bash
uv venv
uv sync
```
This installs all dependencies listed in `pyproject.toml`.

To activate the environment:
``` bash
source .venv/bin/activate
```

To add new packages to the environment, you can use:
```bash
uv add <package-name>
```

To make the `processing` package available in the environment, you can install it in editable mode:
```bash
pip install -e .
