// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract AnonymousFeedback {
    struct Feedback {
        string content;
        uint256 timestamp;
        address submitter; // For validation but not exposed publicly
    }
    
    Feedback[] private feedbacks;
    
    event FeedbackSubmitted(
        uint256 indexed feedbackId,
        uint256 timestamp,
        uint256 contentLength
    );
    
    // Submit anonymous feedback
    function submitFeedback(string memory _content) external {
        require(bytes(_content).length > 0, "Feedback cannot be empty");
        require(bytes(_content).length <= 500, "Feedback too long");
        
        uint256 feedbackId = feedbacks.length;
        
        feedbacks.push(Feedback({
            content: _content,
            timestamp: block.timestamp,
            submitter: msg.sender
        }));
        
        emit FeedbackSubmitted(feedbackId, block.timestamp, bytes(_content).length);
    }
    
    // Get feedback count
    function getFeedbackCount() external view returns (uint256) {
        return feedbacks.length;
    }
    
    // Get feedback by ID (content is publicly readable)
    function getFeedback(uint256 _id) external view returns (
        string memory content,
        uint256 timestamp
    ) {
        require(_id < feedbacks.length, "Feedback does not exist");
        
        Feedback memory feedback = feedbacks[_id];
        return (feedback.content, feedback.timestamp);
    }
    
    // Get latest feedbacks (batch retrieval)
    function getLatestFeedbacks(uint256 _count) external view returns (
        string[] memory contents,
        uint256[] memory timestamps
    ) {
        uint256 totalCount = feedbacks.length;
        uint256 returnCount = _count > totalCount ? totalCount : _count;
        
        contents = new string[](returnCount);
        timestamps = new uint256[](returnCount);
        
        for (uint256 i = 0; i < returnCount; i++) {
            uint256 feedbackIndex = totalCount - 1 - i; // Latest first
            contents[i] = feedbacks[feedbackIndex].content;
            timestamps[i] = feedbacks[feedbackIndex].timestamp;
        }
        
        return (contents, timestamps);
    }
}