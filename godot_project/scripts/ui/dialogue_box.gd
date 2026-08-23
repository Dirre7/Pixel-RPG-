extends CanvasLayer

@onready var panel: Panel = $Panel
@onready var speaker_label: Label = $Panel/SpeakerLabel
@onready var text_label: Label = $Panel/TextLabel
@onready var prompt_label: Label = $Panel/PromptLabel

var current_lines: Array[String] = []
var current_line_idx: int = 0
var is_typing: bool = false
var full_text: String = ""

func _ready() -> void:
	panel.visible = false
	if DialogueManager:
		DialogueManager.dialogue_started.connect(_on_dialogue_started)

func _on_dialogue_started(speaker: String, lines: Array[String]) -> void:
	current_lines = lines
	current_line_idx = 0
	speaker_label.text = speaker
	panel.visible = true
	_show_current_line()

func _show_current_line() -> void:
	if current_line_idx < current_lines.size():
		full_text = current_lines[current_line_idx]
		text_label.text = full_text
		text_label.visible_characters = 0
		is_typing = true
		_run_typewriter()
	else:
		_close_dialogue()

func _run_typewriter() -> void:
	while is_typing and text_label.visible_characters < full_text.length():
		text_label.visible_characters += 1
		await get_tree().create_timer(0.02).timeout
	is_typing = false
	text_label.visible_characters = full_text.length()

func _unhandled_input(event: InputEvent) -> void:
	if not panel.visible:
		return
	if event.is_action_pressed("interact") or event.is_action_pressed("ui_accept"):
		if is_typing:
			is_typing = false
			text_label.visible_characters = full_text.length()
		else:
			current_line_idx += 1
			_show_current_line()
		get_viewport().set_input_as_handled()

func _close_dialogue() -> void:
	panel.visible = false
	if DialogueManager:
		DialogueManager.end_dialogue()
