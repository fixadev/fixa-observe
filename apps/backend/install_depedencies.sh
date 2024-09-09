#!/bin/bash

sudo apt-get update
sudo apt-get install -y libegl1-mesa libegl1-mesa-dev
mkdir public

conda create -n prod-env python=3.10
conda activate prod-env
conda install -c conda-forge manim
pip install -r requirements.txt
