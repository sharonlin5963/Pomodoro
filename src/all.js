(function() {

    new Vue({
        el: '#app',
        data: {
            alert: {
                open: false,
                text: ''
            },
            working: true,
            drawerOpen: false,
            drawerContent: 'todoList',
            doneTodoList: false,
            nowItem: '日用品採買',
            bell: {
                open: true,
                sound: './audio/Crazy_Dinner_Bell.mp3',
                audio: null
            },
            time: {
                start: false,
                timer: null,
                workTimer: [25, 0],
                breakTimer: [5, 0],
                times: 5
            },
            todoData: [{
                    id: 0,
                    tittle: "完成第一關番茄鐘",
                    done: false,
                    workTime: [25, 0],
                    breakTime: [5, 0],
                    bell: "",
                    date: 20200615,
                    times: 5
                },
                {
                    id: 1,
                    tittle: "整理房間",
                    done: false,
                    workTime: [50, 0],
                    breakTime: [10, 0],
                    bell: "",
                    date: 20200528,
                    times: 4
                },
                {
                    id: 2,
                    tittle: "曬衣服",
                    done: true,
                    workTime: [20, 30],
                    breakTime: [3, 0],
                    bell: "",
                    date: 20200524,
                    times: 5
                },
                {
                    id: 3,
                    tittle: "日用品採買",
                    done: false,
                    workTime: [25, 0],
                    breakTime: [5, 0],
                    bell: "",
                    date: 20200520,
                    times: 3
                },
                {
                    id: 4,
                    tittle: "運動",
                    done: true,
                    workTime: [10, 0],
                    breakTime: [0, 30],
                    bell: "",
                    date: 20200511,
                    times: 5
                },
                {
                    id: 5,
                    tittle: "吃番茄",
                    done: false,
                    workTime: [0, 3],
                    breakTime: [0, 2],
                    bell: "",
                    date: 20200530,
                    times: 1
                }, {
                    id: 6,
                    tittle: "拔蘿蔔",
                    done: false,
                    workTime: [25, 0],
                    breakTime: [5, 0],
                    bell: "",
                    date: 20200601,
                    times: 2
                }
            ]

        },
        methods: {
            toggleDrawer(content) {
                if (this.drawerContent === content) return this.drawerOpen = !this.drawerOpen;
                if (!this.drawerOpen) {
                    this.drawerOpen = !this.drawerOpen;
                    this.drawerContent = content;
                    return;
                }
                this.drawerContent = content;
            },
            timerControl() {
                let { start, workTimer, breakTimer } = this.time;
                if (start) return this.stopTimer();

                if (this.working) {
                    let [min, sec] = workTimer;
                    this.timeCountdown(sec, min);
                    this.time.start = true;
                } else {
                    let [min, sec] = breakTimer;
                    this.timeCountdown(sec, min);
                    this.time.start = true;
                }

            },
            timeCountdown(sec, min) {
                this.time.timer = setInterval(
                    () => {
                        if (sec === 0) {
                            sec = 60;
                            min--;
                            if (min === -1) {
                                this.time.times -= 1;
                                this.playSound(this.bell.sound);
                                this.cancelTimer();
                                if (this.time.times === 0) {
                                    this.alertControl(true, '工作完成了');
                                    // let todoTittle = this.todoData.filter(list => { return list.tittle });

                                    // console.log(todoTittle)
                                    return;
                                }

                                this.working = !this.working;
                                return;
                            }
                            if (this.working) return this.time.workTimer.splice(0, 1, min);
                            this.time.breakTimer.splice(0, 1, min);
                        }
                        sec--;
                        if (this.working) return this.time.workTimer.splice(1, 1, sec);
                        this.time.breakTimer.splice(1, 1, sec);
                    }, 1000)
            },
            stopTimer() {
                clearInterval(this.time.timer);
                this.time.timer = null;
                this.time.start = false;
            },
            cancelTimer() {
                this.stopTimer();
                this.initialTimer();
            },
            initialTimer() {
                let nowTodoItem = this.todoData.filter(list => { return list.tittle === this.nowItem; });
                let [workMin, workSec] = nowTodoItem[0].workTime;
                let [breakMin, breakSec] = nowTodoItem[0].breakTime;
                this.time.workTimer.splice(0, 2, workMin, workSec);
                this.time.breakTimer.splice(0, 2, breakMin, breakSec);
            },
            numJudgment(timer) {
                let [min, sec] = timer;
                let time = timer.slice(0);
                if (min < 10) time.splice(0, 1, '0' + min);
                if (sec < 10) time.splice(1, 1, '0' + sec);
                return time;
            },
            toggleBell() {
                this.bell.open = !this.bell.open;
            },
            toggleItem(item) {
                this.nowItem = item;
                this.initialTimer();
                let nowTodoItem = this.todoData.filter(list => { return list.tittle === this.nowItem; });
                this.time.times = (nowTodoItem[0].times) * 2 - 1;
            },
            toggleDoneTodoList(boolean) {
                this.doneTodoList = boolean;
            },
            playSound(sound) {
                if (this.alert.open) {
                    this.bell.audio.pause();
                    this.alertControl(false);
                    return;
                }
                if (sound) {
                    this.bell.audio = new Audio(sound);
                    let audio = this.bell.audio;

                    let text = (this.working) ? '休息囉✧*｡٩(ˊᗜˋ*)و✧*｡' : '工作囉(๑•̀ㅂ•́)و✧';
                    this.alertControl(true, text);

                    audio.muted = (this.bell.open) ? false : true;
                    audio.currentTime = 0;
                    audio.play();
                }
            },
            alertControl(boolean, text) {
                this.alert.text = text
                this.alert.open = boolean;
            }
        },
        computed: {
            nowDrawerContent() {
                if (!this.drawerOpen) return '';
                return this.drawerContent;
            },
            nowTimer() {
                let { start, workTimer, breakTimer } = this.time;
                let workTime = this.numJudgment(workTimer);
                let breakTime = this.numJudgment(breakTimer);
                return (this.working) ? workTime : breakTime
            },
            filterTodoData() {
                let newTodoData = (!this.doneTodoList) ? this.todoData.filter((item) => item.done === false) :
                    this.todoData.filter((item) => item.done === true);
                newTodoData.sort((a, b) => { return a.date - b.date; });
                return newTodoData;
            },
            filterDoingTodoData() {
                return this.todoData.filter((item) => item.done === false).sort((a, b) => { return a.date - b.date; }).slice(0, 4);
            },
            nowTime() {
                return moment().format('HH:mm');
            }
        },
        beforeDestroy() {
            this.cancelTimer();
        }

    })
})()