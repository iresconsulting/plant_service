# 病蟲害診斷服務系統 YOLO 模型建構

### 正式環境建構指令
```
$ 至 python 官網：https://www.python.org/downloads/，下載 ^3.11 版本並安裝。
$ 將 python 安裝路徑加入 PATH。
$ 至 CMAKE 官網：https://cmake.org/download/，下載最新版本並安裝。
$ 至 Visual studio 官網：https://visualstudio.microsoft.com，下載最新版本並安裝。
$ 安裝 Visual Studio ， 勾選「Python開發」與「使用C++的桌面開發」，並按安裝。
$ 至 Open CV 官網 https://opencv.org/releases/page，下載 ^4.1.0 版本。
$ 至 https://github.com/opencv/opencv_contrib，點選 code/Download ZIP。
$ 解壓縮 opencv-4.1.0 以及 opencv_contrib-master 檔案，並將這兩個檔案放在指定路徑內，並創建一個 build 資料夾，該路徑以下簡稱 path。 
$ 開啟 CMAKE，設定路徑， source code=path/opencv-4.1.0， build binaries=path/build。
$ 點選 Configure，設定 generator for this project=下載的 Visual Studio 版本， optional platform = x64。
$ 下滑列表至 build_opencv_world 並將其打勾後，按下 generate。
$ 至 path\build 找到 ALL_BUILD.vcxproj 檔案並開啟。
$ 將 Visual Studio 工作列上方的 Debug 改選為 release。
$ 至「方案總管」展開 CMakeTargets 找到 ALL_BUILD，按右鍵，並點選建置 (BUILD)。
$ 至「方案總管」展開 CMakeTargets 找到 INSTALL (BUILD)。
```
### 模型訓練
```
$ 1. 標註資料：可使用各式標註工具，將圖像內的物件框起來，一般存檔的格式有 YOLO、COCO、VOC 等。
$ 2. 模型訓練：有了圖像及標註檔後，就可以進行模型訓練，以下會詳細介紹完整的程序。
$ 3. 模型測試：測試步驟 #2 所訓練模型之結果。
```
## 1. 標註資料
```
$ pip install labelImg
$ labellmg
$ 開啟 LabelImg 之後，首先開啟想要進行標註的圖片檔，開啟時可以選擇「Open」開啟單張圖檔，或是以「Open Dir」開啟整個目錄中所有的圖檔。
$ 在照片上點選滑鼠右鍵，在右鍵選單中點選「Create RectBox」。
$ 使用滑鼠將「目標」框起來。
$ 輸入這個物件的名稱 (Ex. XYZ蟲害)。
$ 按照上述的物件標註方式，把照片中的每一個物件都標示好。
$ 當一張圖片上的物件都標註完成後，按下左側的「Save」鍵儲存，LabelImg 會使用 XML 格式來儲存標註資訊。
```
## 2. 模型訓練
```
$ 新增 weights 目錄，並下載預訓模型 yolov4.conv.137 至該目錄。
$ 切換至 darknet-master\build\darknet\x64 目錄。
$ 複製 cfg\yolov4-custom.cfg 為 cfg\yolo-obj.cfg。以下5~10步驟修改yolo-obj.cfg檔案內設定。
$ batch=16：原始文件為64，批次過大會造成筆者PC記憶體不足(GPU)，讀者可依據本身的GPU記憶體調配。記憶體不足的錯誤訊息為『Error: cuDNN isn't found FWD algo for convolution』。
$ max_batches=2000：公式為 類別數(classes) x 2000。
$ steps=1600,1800：公式為 max_batches 的 80%、90%。
$ 設定模型輸入的圖像尺寸。width=416，height=416。
$ [yolo] 段落的classes=80更改為classes=1：共3個，可直接使用編輯器的『取代』直接置換，須視類別個數調整。
$ [yolo] 段落的上面一個[convolutional]段落的filters=255更改為filters=18，共3個，請小心修改，filters值須視類別個數調整，公式為(類別個數+5) x 3。
$ 新增檔案 build\darknet\x64\data\obj.names，內容如下，須列出所有類別：
$ 新增檔案 build\darknet\x64\data\obj.data:
classes = 1
train = data/train.txt
valid = data/test.txt
names = data/obj.names
backup = backup/
$ 新增 build\darknet\x64\data\obj\ 目錄，並複製訓練資料(*.jpg、 *.txt) 至該目錄。
$ 新增檔案 build\darknet\x64\data\train.txt，檔案內容為每個圖像檔名。前面加data/obj/。
$ 訓練指令如下，若訓練時有些檔案找不到，試著將檔名及txt檔名改短：
darknet.exe detector train data/obj.data cfg/yolo-obj.cfg weights/yolov4.conv.137
$ 訓練約耗時 3-6 小時，訓練結果會存至 chart_yolo-obj.png。
$ 訓練後的權重檔會儲存在backup目錄，檔名為 yolo-obj_final.weights。
$ 如果訓練中途停止，或要延長訓練週期，可執行指令：
$ darknet.exe detector train data/obj.data cfg/yolo-obj.cfg backup\yolo-obj_2000.weights
```
## 3. 模型測試
```
修改darknet.py 最後第三行，指定相關設定檔：
```
```python
import sys

print(performDetect(sys.argv[1], configPath = "./cfg/yolo-obj.cfg", weightPath = "./backup/yolo-obj_final.weights", metaPath= "./data/obj.data"))
```
測試指令
```
$ python .\darknet_custom.py data\obj\4616855_80b098a3_jpg.rf.a0a319f1836215681493f06c81856b99.jpg
```