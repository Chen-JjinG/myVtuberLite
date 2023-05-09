<template class="this" padding="0">
    <div id="threeRef" ref="threeRef">
    </div>
</template>

<script lang="ts" setup>
//性能监视器
import Stats from 'three/examples/jsm/libs/stats.module.js'

import { defineComponent, onMounted, onUnmounted, ref, render } from 'vue';
import { TextureLoader, GridHelper, Clock, DirectionalLight, AmbientLight, AxesHelper, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer, Group, Quaternion, Vector3, Euler, MathUtils } from 'three';
//加载vrm模型时要用
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { VRM, VRMUtils, VRMLoaderPlugin, VRMHumanBoneName, VRMExpressionPresetName } from "@pixiv/three-vrm";
//@ts-ignore
import { get_model } from '../http/modelserver';

//Mediapipe识别数据与vrm模型绑定的工具引入
import * as Kalidokit from "../core";

//Mediapipe相关工具的引入
import { Holistic } from "@mediapipe/holistic/holistic.js"
import * as HOLISTIC from "@mediapipe/holistic"
import { Camera } from '@mediapipe/camera_utils/camera_utils.js'
import { drawConnectors, drawLandmarks, } from '@mediapipe/drawing_utils/drawing_utils.js'
import { HAND_CONNECTIONS } from '@mediapipe/hands/hands.js'
import { FACEMESH_TESSELATION } from '@mediapipe/face_mesh/face_mesh.js'
import { POSE_CONNECTIONS } from '@mediapipe/pose/pose.js'

//引用Kalidokit
const remap = Kalidokit.Utils.remap;
const clamp = Kalidokit.Utils.clamp;
const lerp = Kalidokit.Vector.lerp;
let stats: Stats = Stats()

//开启性能监视器
function initStats() {
    const stats_element = document.getElementById("status")
    stats.setMode(0)
    stats.domElement.style.position = "relative"
    stats.domElement.style.width = "100%"
    console.log(stats_element)
    stats_element!.appendChild(stats.domElement)
}

//一些变量的定义
//位置偏移量
var positionOffset = ref({
    x: 0,
    y: 1,
    z: 0,
});
let modelTarget = ref('face')
var isFirstInit = true;
const emit = defineEmits(['getPreviewPosition', 'cameraOperate', 'colorChange', 'openLoading'])

//获取vrm模型文件的url
const props = defineProps({
    vrm_fileid: Number,
    // background_color: Object
})

let receive_vrm_fileid = ref(props.vrm_fileid)
let vrm_file_url = ref()
// let background_color = ref(Object.assign(new Color, props.background_color))
// console.log(background_color)
vrm_file_url.value = '/api/file/download/' + receive_vrm_fileid.value?.toString() + '/' + '0'

//定义一个场景
const scene = new Scene();
//创建render渲染器
const renderer = new WebGLRenderer({ alpha: true });
function changeBackground(isColor, key) {
    if (isColor) {
        console.log('color is here')
        renderer.setClearColor(key);
        scene.background = null
        return;
    } else {
        var textureLoader = new TextureLoader();
        var texture = textureLoader.load(key)
        scene.background = texture
    }
}

// export default defineComponent({
//     setup() {
const threeRef = ref()
renderer.setSize(window.innerWidth, window.innerHeight);

//摄像机的创建
const camera = new PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000)//"45"是一个视觉的角度
camera.position.set(0, 1.4, 0.7)

const controls = new OrbitControls(camera, renderer.domElement);
controls.screenSpacePanning = true;
controls.target.set(0.0, 1.4, 0.0);
controls.update();
// camera.position.x = -30;
// camera.position.y = 40;
// camera.position.z = 30;

window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    // 修改相机的参数，宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 更新投影的变换矩阵
    camera.updateProjectionMatrix();
    // 重新设置渲染器尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function init() {
    //emit('openLoading', [false, "加载中..."])
    threeRef.value.appendChild(renderer.domElement);


    // light
    const light = new DirectionalLight(0xffffff);
    light.position.set(1.0, 1.0, 1.0).normalize();
    scene.add(light);

    //欧拉圈坐标辅助
    const helperRoot = new Group();
    helperRoot.renderOrder = 10000;
    // scene.add(helperRoot);

    //坐标系创建
    // const axes = new AxesHelper(20);
    // scene.add(axes);

    // 创建一个地面
    // const planeGeometry = new PlaneGeometry(60, 20);
    // const planeMaterial = new MeshBasicMaterial({ color: 0xcccccc });
    // const plane = new Mesh(planeGeometry);
    // plane.rotation.x = -0.5 * Math.PI;//旋转
    // scene.add(plane);

    //创建网格辅助线
    // var grid = new GridHelper(24, 24, 0xFF0000, 0x444444);
    // scene.add(grid);

    //加载vrm模型
    let currentVrm;
    helperRoot.clear();
    const loader = new GLTFLoader();
    loader.crossOrigin = "anonymous";
    // Install GLTFLoader plugin
    loader.register((parser) => {
        return new VRMLoaderPlugin(parser, { helperRoot: helperRoot, autoUpdateHumanBones: true });
    });

    // const get_3Dmodel = async () => {
    //     await get_model;
    // }

    loader.load(
        "./source/humanModel/Miku2.vrm",
        //从后端加载模型
        // '/api/model/download',
        // vrm_file_url.value,
        (gltf) => {
            const vrm = gltf.userData.vrm;
            console.log(vrm)
            VRMUtils.removeUnnecessaryJoints(gltf.scene);
            VRMUtils.removeUnnecessaryVertices(gltf.scene);

            if (currentVrm) {
                scene.remove(currentVrm.scene);
                VRMUtils.deepDispose(currentVrm.scene);
            }
            currentVrm = vrm;
            //让模型面向摄像头
            currentVrm.scene.rotation.y = Math.PI;
            scene.add(vrm.scene);
            VRMUtils.rotateVRM0(vrm);
        },
        // called while loading is progressing
        (progress) => {
            console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%')
            // 加载动画，在Debug的时候就算了
            emit('openLoading', { loadingBool: true, loadingText: 'Loading...' })
        },
        //(progress) => {  },
        // called when loading has errors
        (error) => console.error(error)
    );

    /* 设置mediapipe相关的实例 */

    let videoElement = document.querySelector(".input_video"),
        guideCanvas = document.querySelector("canvas.guides");

    const onResults = (results) => {
        //console.log(results);
        // 绘制辅助线
        if (isFirstInit) {
            emit('openLoading', { loadingBool: false, loadingText: "Holistic.." })
            isFirstInit = !isFirstInit
        }
        drawResults(results);
        // 让模型运动
        animateVRM(currentVrm, results);
    };

    //从cdn远程请求
    // const holistic = new Holistic({
    //     locateFile: (file) => {
    //         return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
    //     },
    // });

    //还是本地好
    const holistic = new Holistic({
        locateFile: (file) => {
            return `../node_modules/@mediapipe/holistic/${file}`;
        },
    });


    holistic.crossOrigin = "anonymous"
    /*
    holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.7,
        refineFaceLandmarks: true,
    });*/

    holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.4,
        minTrackingConfidence: 0.4
    });


    holistic.onResults(onResults);

    // 用于辅助旋转动画的方法
    const rigRotation = (name, rotation = { x: 0, y: 0, z: 0, rotationOrder: undefined }, dampener = 1, lerpAmount = 0.3) => {
        if (!currentVrm) {
            return;
        }
        const Part = currentVrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName[name]);
        if (!Part) {
            return;
        }

        let euler = new Euler(
            rotation.x * dampener,
            rotation.y * dampener,
            rotation.z * dampener,
            rotation.rotationOrder || "XYZ"
        );
        let quaternion = new Quaternion().setFromEuler(euler);
        Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
    };

    // 用于辅助坐标点定位动画的方法
    const rigPosition = (name, position = { x: 0, y: 0, z: 0 }, dampener = 1, lerpAmount = 0.3) => {
        if (!currentVrm) {
            return;
        }
        const Part = currentVrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName[name]);
        if (!Part) {
            return;
        }
        let vector = new Vector3(position.x * dampener, position.y * dampener, position.z * dampener);
        Part.position.lerp(vector, lerpAmount); // interpolate
    };


    const rigFace = (riggedFace) => {
        if (!currentVrm) {
            return;
        }
        rigRotation("Neck", riggedFace.head, 0.7);

        // VRM模型嘴唇形状的名称以及预设表情的名称
        const Blendshape = currentVrm.expressionManager
        const PresetName = VRMExpressionPresetName;

        const a = remap(riggedFace.mouth.x - 0.4, 0, 0.5);
        riggedFace.mouth.y;
        let o = {
            l: riggedFace.eye.l,
            r: riggedFace.eye.r
        }, r = 0;
        if ((r = clamp(a * 1, 0, 1), r *= o.l !== o.r ? 0 : 1 - remap(o.l, 0.2, 0.8)), o.l !== o.r) {
            o.l = clamp(1 - o.l, 0, 1);
            o.r = clamp(1 - o.r, 0, 1);
            r = 0;
            Blendshape.setValue(PresetName.Blink, 0);
            Blendshape.setValue(PresetName.BlinkLeft, o.l);
            Blendshape.setValue(PresetName.BlinkRight, o.r);
        } else {
            const c = clamp(1 - o.l, 0, 1);
            Blendshape.setValue(PresetName.Blink, c - r);
            Blendshape.setValue(PresetName.BlinkLeft, 0);
            Blendshape.setValue(PresetName.BlinkRight, 0);
        }

        Blendshape.setValue(PresetName.Ih, riggedFace.mouth.shape.I - r);
        Blendshape.setValue(PresetName.Aa, riggedFace.mouth.shape.A * 0.8 - r);
        Blendshape.setValue(PresetName.Ee, riggedFace.mouth.shape.E * 0.8 - r);
        Blendshape.setValue(PresetName.Oh, riggedFace.mouth.shape.O * 0.8 - r);
        Blendshape.setValue(PresetName.Ou, riggedFace.mouth.shape.U * 0.8 - r);


        // 重置表情
        Blendshape.setValue(PresetName.Happy, 0);
        Blendshape.setValue(PresetName.Angry, 0);
        Blendshape.setValue(PresetName.Sad, 0);
        Blendshape.setValue(PresetName.Relaxed, 0);
        Blendshape.setValue(PresetName.Surprised, 0);
        Blendshape.setValue(PresetName.Neutral, 0);
        // 设置表情
        const emotion = riggedFace.emotion?.reduce((prev, curr) => (prev.score > curr.score ? prev : curr));
        switch (emotion?.emotion || '') {
            case 'happy': Blendshape.setValue(PresetName.Happy, 1); break;
            case 'angry': Blendshape.setValue(PresetName.Angry, 1); break;
            case 'sad': Blendshape.setValue(PresetName.Sad, 1); break;
            case 'relaxed': Blendshape.setValue(PresetName.Relaxed, 1); break;
            case 'surprised': Blendshape.setValue(PresetName.Surprised, 1); break;
            case 'neutral': Blendshape.setValue(PresetName.Neutral, 1); break;
            default: break;
        }


        let euler = new Euler(riggedFace.pupil.y, riggedFace.pupil.x, 0, 'XYZ');
        /*
        // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
        // for VRM, 1 is closed, 0 is open.
        riggedFace.eye.l = lerp(clamp(1 - riggedFace.eye.l, 0, 1), Blendshape.getValue(PresetName.Blink), 0.5);
        riggedFace.eye.r = lerp(clamp(1 - riggedFace.eye.r, 0, 1), Blendshape.getValue(PresetName.Blink), 0.5);
        riggedFace.eye = Kalidokit.Face.stabilizeBlink(riggedFace.eye, riggedFace.head.y);
        Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);
        Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);
        Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);

        // Interpolate and set mouth blendshapes
        Blendshape.setValue(PresetName.I, lerp(riggedFace.mouth.shape.I, Blendshape.getValue(PresetName.I), 0.5));
        Blendshape.setValue(PresetName.A, lerp(riggedFace.mouth.shape.A, Blendshape.getValue(PresetName.A), 0.5));
        Blendshape.setValue(PresetName.E, lerp(riggedFace.mouth.shape.E, Blendshape.getValue(PresetName.E), 0.5));
        Blendshape.setValue(PresetName.O, lerp(riggedFace.mouth.shape.O, Blendshape.getValue(PresetName.O), 0.5));
        Blendshape.setValue(PresetName.U, lerp(riggedFace.mouth.shape.U, Blendshape.getValue(PresetName.U), 0.5));
    
        //PUPILS
        //interpolate pupil and keep a copy of the value
        let lookTarget = new THREE.Euler(
            lerp(oldLookTarget.x, riggedFace.pupil.y, 0.4),
            lerp(oldLookTarget.y, riggedFace.pupil.x, 0.4),
            0,
            "XYZ"
        );
        oldLookTarget.copy(lookTarget);
        */
        const yaw = MathUtils.RAD2DEG * euler.y;
        const pitch = MathUtils.RAD2DEG * euler.x;
        currentVrm.lookAt.applier.applyYawPitch(yaw, pitch);
        //currentVrm.lookAt.applier.lookAt(lookTarget);
    };

    /* VRM模型动画 */
    const animateVRM = (vrm, results) => {
        if (!vrm) {
            return;
        }
        // 从“Holistic”中获取结果，并根据角色的“面部”、“姿势”和“手部关键点”绑定觉得动画
        let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

        const faceLandmarks = results.faceLandmarks;

        // 姿势3D标志是关于髋部距离的，单位为米
        const pose3DLandmarks = results.za;
        // 姿势2D地标与视频宽度和视频高度有关
        const pose2DLandmarks = results.poseLandmarks;

        const leftHandLandmarks = results.rightHandLandmarks;
        const rightHandLandmarks = results.leftHandLandmarks;

        // 脸部的动画绑定
        if (faceLandmarks) {
            riggedFace = Kalidokit.Face.solve(faceLandmarks, {
                runtime: "mediapipe",
                //@ts-ignore
                video: videoElement,
            });
            rigFace(riggedFace);
        }

        // 姿态的动画绑定
        if (pose2DLandmarks && pose3DLandmarks) {
            riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
                runtime: "mediapipe",
                //@ts-ignore
                video: videoElement,
            });
            //输出debug一下
            //console.log(riggedPose)

            //上身
            rigRotation("Chest", riggedPose.Spine, 0.55, 0.3);
            rigRotation("Spine", riggedPose.Spine, 0.45, 0.3);

            //上肢
            rigRotation("RightUpperArm", riggedPose.RightUpperArm, 1, 0.3);
            rigRotation("RightLowerArm", riggedPose.RightLowerArm, 1, 0.3);
            rigRotation("LeftUpperArm", riggedPose.LeftUpperArm, 1, 0.3);
            rigRotation("LeftLowerArm", riggedPose.LeftLowerArm, 1, 0.3);


            //如果目标不是定位的全身就不用继续识别下身动画
            if (modelTarget.value == "full") {

                //髋部
                rigRotation("Hips", riggedPose.Hips.rotation, 0.7);
                rigPosition(
                    "Hips",
                    {
                        x: riggedPose.Hips.position.x + positionOffset.value.x, // Reverse direction
                        y: riggedPose.Hips.position.y + positionOffset.value.y, // Add a bit of height
                        z: -riggedPose.Hips.position.z + positionOffset.value.z, // Reverse direction
                    },
                    1,
                    0.07
                );
                //下肢
                rigRotation("LeftUpperLeg", riggedPose.LeftUpperLeg, 1, 0.3);
                rigRotation("LeftLowerLeg", riggedPose.LeftLowerLeg, 1, 0.3);
                rigRotation("RightUpperLeg", riggedPose.RightUpperLeg, 1, 0.3);
                rigRotation("RightLowerLeg", riggedPose.RightLowerLeg, 1, 0.3);
            } else {
                //髋部
                rigRotation("Hips", { x: 0, y: 0, z: 0, rotationOrder: undefined }, 0.7);
                console.log(riggedPose.Hips.rotation);
                rigPosition(
                    "Hips",
                    {
                        x: 0 + positionOffset.value.x, // Reverse direction
                        y: 0 + positionOffset.value.y, // Add a bit of height
                        z: 0 + positionOffset.value.z, // Reverse direction
                    },
                    1,
                    0.07
                );

            }

        }
        // 手部的动画绑定
        if (leftHandLandmarks) {
            riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left");
            rigRotation("LeftHand", {
                // 组合姿势旋转Z和手旋转X Y
                z: riggedPose.LeftHand.z,
                y: riggedLeftHand.LeftWrist.y,
                x: riggedLeftHand.LeftWrist.x,
                rotationOrder: undefined
            });
            rigRotation("LeftRingProximal", riggedLeftHand.LeftRingProximal);
            rigRotation("LeftRingIntermediate", riggedLeftHand.LeftRingIntermediate);
            rigRotation("LeftRingDistal", riggedLeftHand.LeftRingDistal);
            rigRotation("LeftIndexProximal", riggedLeftHand.LeftIndexProximal);
            rigRotation("LeftIndexIntermediate", riggedLeftHand.LeftIndexIntermediate);
            rigRotation("LeftIndexDistal", riggedLeftHand.LeftIndexDistal);
            rigRotation("LeftMiddleProximal", riggedLeftHand.LeftMiddleProximal);
            rigRotation("LeftMiddleIntermediate", riggedLeftHand.LeftMiddleIntermediate);
            rigRotation("LeftMiddleDistal", riggedLeftHand.LeftMiddleDistal);
            rigRotation("LeftThumbProximal", riggedLeftHand.LeftThumbProximal);
            rigRotation("LeftThumbIntermediate", riggedLeftHand.LeftThumbIntermediate);
            rigRotation("LeftThumbDistal", riggedLeftHand.LeftThumbDistal);
            rigRotation("LeftLittleProximal", riggedLeftHand.LeftLittleProximal);
            rigRotation("LeftLittleIntermediate", riggedLeftHand.LeftLittleIntermediate);
            rigRotation("LeftLittleDistal", riggedLeftHand.LeftLittleDistal);
        }
        if (rightHandLandmarks) {
            riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
            rigRotation("RightHand", {
                // 组合姿势手的Z轴和手腕旋转的X/Y轴
                z: riggedPose.RightHand.z,
                y: riggedRightHand.RightWrist.y,
                x: riggedRightHand.RightWrist.x,
                rotationOrder: undefined
            });
            rigRotation("RightRingProximal", riggedRightHand.RightRingProximal);
            rigRotation("RightRingIntermediate", riggedRightHand.RightRingIntermediate);
            rigRotation("RightRingDistal", riggedRightHand.RightRingDistal);
            rigRotation("RightIndexProximal", riggedRightHand.RightIndexProximal);
            rigRotation("RightIndexIntermediate", riggedRightHand.RightIndexIntermediate);
            rigRotation("RightIndexDistal", riggedRightHand.RightIndexDistal);
            rigRotation("RightMiddleProximal", riggedRightHand.RightMiddleProximal);
            rigRotation("RightMiddleIntermediate", riggedRightHand.RightMiddleIntermediate);
            rigRotation("RightMiddleDistal", riggedRightHand.RightMiddleDistal);
            rigRotation("RightThumbProximal", riggedRightHand.RightThumbProximal);
            rigRotation("RightThumbIntermediate", riggedRightHand.RightThumbIntermediate);
            rigRotation("RightThumbDistal", riggedRightHand.RightThumbDistal);
            rigRotation("RightLittleProximal", riggedRightHand.RightLittleProximal);
            rigRotation("RightLittleIntermediate", riggedRightHand.RightLittleIntermediate);
            rigRotation("RightLittleDistal", riggedRightHand.RightLittleDistal);
        }
    };

    
    const drawResults = (results) => {
        //@ts-ignore
        guideCanvas.width = videoElement.videoWidth;
        //@ts-ignore
        guideCanvas.height = videoElement.videoHeight;
        //@ts-ignore
        let canvasCtx = guideCanvas.getContext("2d");
        canvasCtx.save();
        //@ts-ignore
        canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);

        // 使用Mediapipe的绘制功能

        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
            color: "#00cff7",
            lineWidth: 4,
        });

        drawLandmarks(canvasCtx, results.poseLandmarks, {
            color: "#ff0364",
            lineWidth: 2,
        });

        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
            color: "#C0C0C070",
            lineWidth: 1,
        });

        if (results.faceLandmarks && results.faceLandmarks.length === 478) {
            //绘制瞳孔
            drawLandmarks(canvasCtx, [results.faceLandmarks[468], results.faceLandmarks[468 + 5]], {
                color: "#ffe603",
                lineWidth: 2,
            });
        }

        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
            color: "#eb1064",
            lineWidth: 5,
        });

        drawLandmarks(canvasCtx, results.leftHandLandmarks, {
            color: "#00cff7",
            lineWidth: 2,
        });

        drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
            color: "#22c3e3",
            lineWidth: 5,
        });

        drawLandmarks(canvasCtx, results.rightHandLandmarks, {
            color: "#ff0364",
            lineWidth: 2,
        });
    };

    // 用Mediapipe获取录像内容

    const mediaCamera = new Camera(videoElement, {
        onFrame: async () => {
            await holistic.send({ image: videoElement });
        },
        width: 640,
        height: 480,
    });
    //调试页面的时候暂时不想开摄像头
    mediaCamera.start();


    // 主要的渲染循环
    const clock = new Clock();
    clock.start();

    function animate() {
        stats.update()
        requestAnimationFrame(animate);
        if (currentVrm) {
            // 更新模型的物理状态
            // console.log(currentVrm.scene.position);
            currentVrm.update(clock.getDelta());
            // console.log(camera);
        }
        renderer.render(scene, camera);
    }
    animate();
    //renderer.render(scene, camera);

}
function changeTarget(target) {
    modelTarget.value = target;
    console.log(target)
    if (modelTarget.value == "face") {
        positionOffset.value = { x: 0, y: 1, z: 0 };
    } else if (modelTarget.value == "half") {
        positionOffset.value = {
            x: 0,
            y: 1.1,
            z: 1,
        };
    } else if (modelTarget.value == "full") {
        positionOffset.value = {
            x: 0,
            y: 1.4,
            z: 2,
        };
    }
}

document.addEventListener("keydown", (event) => {
    var step = 0.1;
    switch (event.key) {
        case "d":
        case "ArrowRight":
            positionOffset.value.x -= step;
            break;
        case "a":
        case "ArrowLeft":
            positionOffset.value.x += step;
            break;
        case "w":
        case "ArrowUp":
            positionOffset.value.y += step;
            break;
        case "s":
        case "ArrowDown":
            positionOffset.value.y -= step;
            break;
    }
});

onMounted(() => {
    initStats()
    init()
    // changeBackground(false, '/api/file/download/2/1')
    changeBackground(false,"./source/images/loginBackground.png")
})


defineExpose({
    changeTarget,
    changeBackground,
})
</script>