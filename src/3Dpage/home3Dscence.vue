<template padding="0">
    <div ref="threeRef">

    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, render } from 'vue';
import { GridHelper, Clock, DirectionalLight, AmbientLight, AxesHelper, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer } from 'three';
//加载vrm模型时要用
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { VRM, VRMUtils, VRMLoaderPlugin } from "@pixiv/three-vrm";

export default defineComponent({
    setup() {
        const threeRef = ref()
        function init() {
            const scene = new Scene();

            //创建渲染器render
            const renderer = new WebGLRenderer();
            renderer.setClearColor(new Color(0x40E0D0));
            renderer.setSize(window.innerWidth, window.innerHeight);
            threeRef.value.appendChild(renderer.domElement);

            //摄像机的创建
            const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000)//"45"是一个视觉的角度
            camera.position.set(0, 1.5, -3.0)
            // camera.position.x = -30;
            // camera.position.y = 40;
            // camera.position.z = 30;
            camera.lookAt(scene.position);
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.screenSpacePanning = true;
            controls.target.set(0.0, 1.0, 0.0);
            controls.update();

            // light
            const light = new DirectionalLight(0xffffff);
            light.position.set(1.0, 1.0, 1.0).normalize();
            scene.add(light);

            //坐标系创建
            const axes = new AxesHelper(20);
            scene.add(axes);

            // 创建一个地面
            // const planeGeometry = new PlaneGeometry(60, 20);
            // const planeMaterial = new MeshBasicMaterial({ color: 0xcccccc });
            // const plane = new Mesh(planeGeometry);
            // plane.rotation.x = -0.5 * Math.PI;//旋转
            // scene.add(plane);

            //创建网格辅助线
            var grid = new GridHelper(24, 24, 0xFF0000, 0x444444);
            scene.add(grid);

            //加载vrm模型
            let currentVrm;
            const loader = new GLTFLoader();
            loader.crossOrigin = "anonymous";
            // Install GLTFLoader plugin
            loader.register((parser) => {
                return new VRMLoaderPlugin(parser);
            });

            loader.load(
                "./source/humanModel/Miku2.vrm",
                (gltf) => {
                    const vrm = gltf.userData.vrm;

                    VRMUtils.removeUnnecessaryJoints(gltf.scene);
                    VRMUtils.removeUnnecessaryVertices(gltf.scene);
                    currentVrm = vrm;
                    console.log(vrm);
                    scene.add(vrm.scene);
                },
                // called while loading is progressing
                (progress) => console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),

                // called when loading has errors
                (error) => console.error(error)
            );

            // Main Render Loop
            const clock = new Clock();
            clock.start();

            function animate() {
                requestAnimationFrame(animate);
                if (currentVrm) {
                    // Update model to render physics
                    // console.log(currentVrm.scene.rotation);
                    currentVrm.scene.rotation.y += Math.PI / 300;
                    currentVrm.update(clock.getDelta());
                    //console.log(camera);
                }
                renderer.render(scene, camera);
            }
            animate();
            // renderer.render(scene,camera);

        }
        onMounted(() => {
            init()
        })
        return {
            threeRef
        }
    },
})
</script>
