extends Node

signal dialogue_started(speaker_name: String, lines: Array[String])
signal dialogue_ended()

var is_dialogue_active: bool = false

func start_dialogue(speaker: String, lines: Array[String]) -> void:
	if is_dialogue_active:
		return
	is_dialogue_active = true
	dialogue_started.emit(speaker, lines)

func end_dialogue() -> void:
	is_dialogue_active = false
	dialogue_ended.emit()
