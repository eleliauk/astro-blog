---
title: YOLO初体验
published: 2024-08-29T13:19:59.000Z
description: ''
updated: ''
tags: []
draft: false
pin: 0
toc: true
lang: zh
abbrlink: ''
---

# YOLO初体验

也是炼上丹了

这篇可能主要是记录一些方法 可能跟之前写的分享不太一样

yolo训练阶段

验证模型

```python
yolo detect val data=YOLOv8_cs/datasets/page_seg/page_icon.yaml model=YOLOv8_cs/runs/detect/best.pt batch=4
```

训练自己的数据集 我这个用的是coco128数据集的格式

首先要有 img文件夹 放自己要训练的图片

然后你需要 在label文件夹 放出自己标注出来的txt

然后还需要写个解释文件

belike：

```yaml
# Ultralytics YOLOv5 🚀, AGPL-3.0 license
# COCO128 dataset https://www.kaggle.com/ultralytics/coco128 (first 128 images from COCO train2017) by Ultralytics
# Example usage: python train.py --data coco128.yaml
# parent
# ├── yolov5
# └── datasets
#     └── coco128  ← downloads here (7 MB)

# Train/val/test sets as 1) dir: path/to/imgs, 2) file: path/to/imgs.txt, or 3) list: [path/to/imgs1, path/to/imgs2, ..]
path: /Users/shanyujia/学习资料/课外学习/开源之夏/inula-code-generator/YOLOv8_cs/datasets/page_seg # dataset root dir
train: images/train # train images (relative to 'path') 128 images
val: images/train # val images (relative to 'path') 128 images
test: # test images (optional)

# Classes
names:
  0: Header
  1: Footer
  2: Navbar
  3: Sidebar
  4: Button
  5: Text
  6: Image
  7: Input
  8: Checkbox
  9: Radio
  10: Dropdown
  11: Form
  12: Link
  13: Table
  14: Card
  15: Modal
  16: Icon
  17: Logo
  18: Slider
  19: Search
  20: Select
  21: Video
  22: Pagination
  23: Carousel
  24: Tabs
```

然后执行训练命令

```
yolo detect train data=datasets/button.v3i.yolov8/data.yaml model=yolov8n.yaml pretrained=ultralytics/yolov8n.pt epochs=100 batch=4 lr0=0.01 resume=True
```
