(function() {

    new Vue({
        el: '#app',
        data: {
            working: true,
            drawerOpen: false,
            drawerContent: 'todoList',
            bell: true,
            time: {
                start: false,
                timer: null,
                workTimer: [0, 10],
                breakTimer: [5, 0]
            }

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
                                this.working = !this.working;
                                this.cancelTimer();
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
                this.time.workTimer.splice(0, 2, 25, 0);
                this.time.breakTimer.splice(0, 2, 5, 0);
            },
            numJudgment(timer) {
                let [min, sec] = timer;
                let time = timer.slice(0);
                if (min < 10) time.splice(0, 1, '0' + min);
                if (sec < 10) time.splice(1, 1, '0' + sec);
                return time;
            },
            toggleBell() {
                this.bell = !this.bell;
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
            }
        },
        beforeDestroy() {
            this.cancelTimer();
        }

    })
})()