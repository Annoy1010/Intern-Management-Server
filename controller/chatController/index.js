const chatModel = require("../../model/chatModel");

const getTeacher = async (req, res) => {
    try {
        const userId = await chatModel.getUserId(req.headers.authentication);
        console.log(userId);
        if (!userId) return res.status(403).json('Vui lòng đăng nhập!');

        const teacher = await chatModel.getTeacher(userId);
        return res.status(200).json(teacher);
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.massage});
    }
}

const getMessage = async (req, res) => {
    try {        
        const userId = await chatModel.getUserId(req.headers.authentication);
        console.log(userId);
        if (!userId) return res.status(403).json('Vui lòng đăng nhập!');

        const studentId = await chatModel.getStudentIdByUserId(userId);

        const conversationId = await chatModel.getConversationId(userId, studentId);
        if (conversationId.length === 0) {
            return res.status(200).json();
        }
        console.log("conversationId: ", conversationId[0].id);

        const message = await chatModel.getMessage(conversationId[0].id);
        console.log("message: ", message);
        return res.status(200).json(message);
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.message});
    }
}

const getMessageTeacher = async (req, res) => {
    try {        
        const userId = await chatModel.getUserId(req.headers.authentication);
        console.log(userId);
        if (!userId) return res.status(403).json('Vui lòng đăng nhập!');
        const studentId = parseInt(req.params.id);
        if (!studentId) return res.status(403).json('Không tìm thấy người dùng!');


        const conversation = (await chatModel.getConversationId(userId, studentId))[0].id;
        if (!conversation) {
            return res.status(200).json();
        }

        const message = await chatModel.getMessage(conversation);
        console.log("message: ", message);
        console.log("conversationId: ", conversation);
        return res.status(200).json(message);
        // for (id of conversation) {
        //     if (id.studentId === studentId) {
        //         const message = await chatModel.getMessage(id.id);
        //         console.log("message: ", message);
        //         return res.status(200).json(message);
        //     }
        // }
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.message});
    }
}

const sendMessage = async (socket, io) => {
    socket.on("sendDataClient", async (data) => {
        console.log(data);

        // handle save message
        let conversationId = (await chatModel.getConversationId(data.userId, data.studentId))[0]?.id;
        console.log("Old conversationId: ",conversationId);
        if (!conversationId) {
            conversationId = await chatModel.saveConversation(data.studentId, data.teacherId)
            console.log("New conversationId: ", conversationId);
        }
        console.log(data);
        await chatModel.saveMessage(data, conversationId);

        io.emit("sendDataServer", { data });
    });
}

const getStudents = async (req, res) => {
    try {
        const userId = await chatModel.getUserId(req.headers.authentication);
        console.log('UserId: ', userId);
        if (!userId) return res.status(403).json('Vui lòng đăng nhập trước khi sử dụng ứng dụng!');

        const students = await chatModel.getStudents(userId);
        console.log('Students: ', students);
        return res.status(200).json(students);
    } catch (e) {
        console.log(e);
        return res.status(500).json({detail: e.message});
    }
}

module.exports = {
    getTeacher,
    getMessage,
    sendMessage,
    getStudents,
    getMessageTeacher,
}