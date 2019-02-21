<?php
/**
 * WebRTC信令服务 -- 基于PHP + Swoole
 * CreateBy: 重庆市筑云科技--曾伟
 * Date: 2019/2/18
 * Time: 9:46
 */

class WebRTCServer
{
    private $server;
    private $file = '1.json';

    public function __construct()
    {
        $this->server = new swoole_websocket_server("0.0.0.0", 3000);

        $this->server->set([
            'daemonize'=> 0,
            //需要用到wss
            /*'ssl_cert_file' => '/usr/local/nginx/conf/ssl/***.crt',
            'ssl_key_file' => '/usr/local/nginx/conf/ssl/***.key',*/
        ]);

        $this->server->on('open', [$this, 'open']);
        $this->server->on('message', [$this, 'message']);
        $this->server->on('close', [$this, 'close']);

        $this->server->start();
    }

    public function open($server, $request){
        $room = $request->get['room'];
        $con_fd = json_decode(file_get_contents($this->file),true);
        if($con_fd == null) $con_fd=[];
        if(!isset($con_fd[$room])) $con_fd[$room]=[];
        array_push($con_fd[$room],$request->fd);
        file_put_contents($this->file,json_encode($con_fd));
    }

    public function message($server, $frame){
        $con_fd = json_decode(file_get_contents($this->file),true);
        $frameData = json_decode($frame->data,true);
        switch ($frameData['eventName']){
            case '__join':
                $this->JoinRoom($server,$con_fd,$frame);
                break;
            case '__ice_candidate':
                $this->transIceCandidate($server,$frame);
                break;
            case '__offer':
                $this->transOffer($server,$frame);
                break;
            case '__answer':
                $this->transAnswer($server,$frame);
                break;
            default:

        }
    }

    public function close($server, $fd){
        $con_fd = json_decode(file_get_contents($this->file),true);
        $room = null;
        if($con_fd){
            foreach ($con_fd as $key=>$val){
                foreach ($val as $kk=>$vv){
                    if($vv == $fd){
                        $room = $key;//找出房间号
                        unset($con_fd[$key][$kk]);
                    }
                }
            }
            if($room && isset($con_fd[$room])){
                $remove = json_encode([
                    'eventName' => '_remove_peer',
                    'data' => [
                        'socketId'=>$fd,
                    ]
                ]);
                foreach ($con_fd[$room] as $val) $server->push($val,$remove);
            }
            file_put_contents($this->file,json_encode($con_fd));
        }
    }

    //加入房间--向其他用户发送自己的描述符信息--向自己发送所有用户描述符
    public function JoinRoom($server,$con_fd,$frame)
    {
        $frameData = json_decode($frame->data,true);
        if(isset($con_fd[$frameData['data']['room']])){
            foreach ($con_fd[$frameData['data']['room']] as $value){
                if($frame->fd == $value) continue;
                $server->push($value,json_encode([
                    'eventName' => '_new_peer',
                    'data' => [
                        'socketId'=>$frame->fd
                    ]
                ]));
            }
            $index = array_search($frame->fd,$con_fd[$frameData['data']['room']]);
            unset($con_fd[$frameData['data']['room']][$index]);
            $peers = json_encode([
                'eventName' => '_peers',
                'data' => [
                    'connections'=>$con_fd[$frameData['data']['room']],
                    'you'=>$frame->fd,
                ]
            ]);
            $server->push($frame->fd,$peers);
        }
    }

    //转发同等连接候选人信息
    public function transIceCandidate($server,$frame)
    {
        $frameData = json_decode($frame->data,true);
        $ice_candidate = json_encode([
            'eventName' => '_ice_candidate',
            'data' => [
                'label'=>$frameData['data']['label'],
                'candidate'=>$frameData['data']['candidate'],
                'socketId'=>$frame->fd,
            ]
        ]);
        $server->push($frameData['data']['socketId'],$ice_candidate);
    }

    //转发同等连接Offer
    public function transOffer($server,$frame)
    {
        $frameData = json_decode($frame->data,true);
        $offer = json_encode([
            'eventName' => '_offer',
            'data' => [
                'sdp'=>$frameData['data']['sdp'],
                'socketId'=>$frame->fd,
            ]
        ]);
        $server->push($frameData['data']['socketId'],$offer);
    }

    //转发同等连接Answer
    public function transAnswer($server,$frame)
    {
        $frameData = json_decode($frame->data,true);
        $answer = json_encode([
            'eventName' => '_answer',
            'data' => [
                'sdp'=>$frameData['data']['sdp'],
                'socketId'=>$frame->fd,
            ]
        ]);
        $server->push($frameData['data']['socketId'],$answer);
    }
}

new WebRTCServer();